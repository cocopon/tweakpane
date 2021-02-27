import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {ButtonController} from '../plugin/blade/button/controller';
import {InputBindingController} from '../plugin/blade/common/controller/input-binding';
import {MonitorBindingController} from '../plugin/blade/common/controller/monitor-binding';
import {Blade} from '../plugin/blade/common/model/blade';
import {FolderController} from '../plugin/blade/folder/controller';
import {SeparatorController} from '../plugin/blade/separator/controller';
import {TpChangeEvent} from '../plugin/common/event/tp-event';
import {Color} from '../plugin/input-bindings/color/model/color';
import {NumberTextController} from '../plugin/input-bindings/number/controller/number-text';
import {SingleLogMonitorController} from '../plugin/monitor-bindings/common/controller/single-log';
import {FolderApi} from './folder';
import {InputBindingApi} from './input-binding';
import {SeparatorApi} from './separator';

function createApi(): FolderApi {
	const c = new FolderController(TestUtil.createWindow().document, {
		blade: new Blade(),
		title: 'Folder',
	});
	return new FolderApi(c);
}

describe(FolderApi.name, () => {
	it('should get expanded', () => {
		const api = createApi();

		api.controller.folder.expanded = false;
		assert.strictEqual(api.expanded, false);
		api.controller.folder.expanded = true;
		assert.strictEqual(api.expanded, true);
	});

	it('should set expanded', () => {
		const api = createApi();

		api.expanded = false;
		assert.strictEqual(api.controller.folder.expanded, false);
		api.expanded = true;
		assert.strictEqual(api.controller.folder.expanded, true);
	});

	it('should dispose', () => {
		const api = createApi();
		api.dispose();
		assert.strictEqual(api.controller.blade.disposed, true);
	});

	it('should hide', () => {
		const api = createApi();
		assert.strictEqual(api.hidden, false);

		api.hidden = true;
		assert.isTrue(
			api.controller.view.element.classList.contains('tp-v-hidden'),
		);
	});

	it('should add button', () => {
		const api = createApi();
		const b = api.addButton({
			title: 'push',
		});
		assert.strictEqual(b.controller.button.title, 'push');
	});

	it('should add separator', () => {
		const api = createApi();
		const s = api.addSeparator();
		assert.instanceOf(s, SeparatorApi);

		const cs = api.controller.bladeRack.items;
		assert.instanceOf(cs[cs.length - 1], SeparatorController);
	});

	it('should dispose separator', () => {
		const api = createApi();
		const cs = api.controller.bladeRack.items;

		const s = api.addSeparator();
		assert.strictEqual(cs.length, 1);
		s.dispose();
		assert.strictEqual(cs.length, 0);
	});

	it('should add input', () => {
		const PARAMS = {
			foo: 1,
		};
		const api = createApi();
		const bapi = api.addInput(PARAMS, 'foo');
		assert.instanceOf(bapi.controller.controller, NumberTextController);
	});

	it('should add monitor', () => {
		const PARAMS = {
			foo: 1,
		};
		const api = createApi();
		const bapi = api.addMonitor(PARAMS, 'foo', {
			interval: 0,
		});
		assert.instanceOf(bapi.controller.controller, SingleLogMonitorController);
	});

	it('should listen fold event', (done) => {
		const api = createApi();
		api.on('fold', () => {
			done();
		});
		api.controller.folder.expanded = false;
	});

	[
		{
			insert: (api: FolderApi, index: number) => {
				api.addInput({foo: 1}, 'foo', {index: index});
			},
			expected: InputBindingController,
		},
		{
			insert: (api: FolderApi, index: number) => {
				api.addMonitor({foo: 1}, 'foo', {
					index: index,
					interval: 0,
				});
			},
			expected: MonitorBindingController,
		},
		{
			insert: (api: FolderApi, index: number) => {
				api.addButton({index: index, title: 'button'});
			},
			expected: ButtonController,
		},
		{
			insert: (api: FolderApi, index: number) => {
				api.addSeparator({
					index: index,
				});
			},
			expected: SeparatorController,
		},
	].forEach((testCase) => {
		context(`when ${testCase.expected.name}`, () => {
			it('should insert input/monitor into specified position', () => {
				const params = {
					bar: 2,
					foo: 1,
				};
				const api = createApi();
				api.addInput(params, 'foo');
				api.addInput(params, 'bar');
				testCase.insert(api, 1);

				const cs = api.controller.bladeRack.items;
				assert.instanceOf(cs[1], testCase.expected);
			});
		});
	});

	[
		{
			expected: 456,
			params: {
				propertyValue: 123,
				newInternalValue: 456,
			},
		},
		{
			expected: 'changed',
			params: {
				propertyValue: 'text',
				newInternalValue: 'changed',
			},
		},
		{
			expected: true,
			params: {
				propertyValue: false,
				newInternalValue: true,
			},
		},
		{
			expected: '#224488',
			params: {
				propertyValue: '#123',
				newInternalValue: new Color([0x22, 0x44, 0x88], 'rgb'),
			},
		},
		{
			expected: 'rgb(0, 127, 255)',
			params: {
				propertyValue: 'rgb(10, 20, 30)',
				newInternalValue: new Color([0, 127, 255], 'rgb'),
			},
		},
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should pass event for change event (local)', (done) => {
				const api = createApi();
				const obj = {foo: params.propertyValue};
				const bapi = api.addInput(obj, 'foo');

				bapi.on('change', (ev) => {
					assert.instanceOf(ev, TpChangeEvent);
					assert.strictEqual(ev.target, bapi);
					assert.strictEqual(ev.presetKey, 'foo');
					assert.strictEqual(ev.value, expected);
					done();
				});
				bapi.controller.binding.value.rawValue = params.newInternalValue;
			});

			it('should pass event for change event (global)', (done) => {
				const api = createApi();
				const obj = {foo: params.propertyValue};
				const bapi = api.addInput(obj, 'foo');

				api.on('change', (ev) => {
					assert.instanceOf(ev, TpChangeEvent);
					assert.strictEqual(ev.presetKey, 'foo');
					assert.strictEqual(ev.value, expected);

					if (!(ev.target instanceof InputBindingApi)) {
						throw new Error('unexpected target');
					}
					assert.strictEqual(ev.target.controller, bapi.controller);

					done();
				});
				bapi.controller.binding.value.rawValue = params.newInternalValue;
			});
		});
	});

	it('should bind `this` within handler to folder', (done) => {
		const PARAMS = {foo: 1};
		const api = createApi();
		api.on('change', function(this: any) {
			assert.strictEqual(this, api);
			done();
		});

		const bapi = api.addInput(PARAMS, 'foo');
		bapi.controller.binding.value.rawValue = 2;
	});
});
