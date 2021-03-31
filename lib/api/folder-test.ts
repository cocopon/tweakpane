import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {InputBindingController} from '../plugin/blade/common/controller/input-binding';
import {MonitorBindingController} from '../plugin/blade/common/controller/monitor-binding';
import {Blade} from '../plugin/blade/common/model/blade';
import {FolderController} from '../plugin/blade/folder/controller';
import {LabeledController} from '../plugin/blade/labeled/controller';
import {SeparatorController} from '../plugin/blade/separator/controller';
import {createViewProps} from '../plugin/common/model/view-props';
import {Color} from '../plugin/input-bindings/color/model/color';
import {NumberTextController} from '../plugin/input-bindings/number/controller/number-text';
import {SingleLogMonitorController} from '../plugin/monitor-bindings/common/controller/single-log';
import {FolderApi} from './folder';
import {InputBindingApi} from './input-binding';
import {SeparatorApi} from './separator';
import {TpChangeEvent} from './tp-event';

function createApi(): FolderApi {
	const doc = TestUtil.createWindow().document;
	const c = new FolderController(doc, {
		blade: new Blade(),
		title: 'Folder',
		viewProps: createViewProps(),
	});
	return new FolderApi(c);
}

describe(FolderApi.name, () => {
	it('should get expanded', () => {
		const api = createApi();

		api.controller_.folder.expanded = false;
		assert.strictEqual(api.expanded, false);
		api.controller_.folder.expanded = true;
		assert.strictEqual(api.expanded, true);
	});

	it('should set expanded', () => {
		const api = createApi();

		api.expanded = false;
		assert.strictEqual(api.controller_.folder.expanded, false);
		api.expanded = true;
		assert.strictEqual(api.controller_.folder.expanded, true);
	});

	it('should dispose', () => {
		const api = createApi();
		api.dispose();
		assert.strictEqual(api.controller_.blade.disposed, true);
	});

	it('should hide', () => {
		const api = createApi();
		assert.strictEqual(api.hidden, false);

		api.hidden = true;
		assert.strictEqual(
			api.controller_.view.element.classList.contains('tp-v-hidden'),
			true,
		);
	});

	it('should add button', () => {
		const api = createApi();
		const b = api.addButton({
			title: 'push',
		});
		assert.strictEqual(b.controller_.valueController.button.title, 'push');
	});

	it('should add separator', () => {
		const api = createApi();
		const s = api.addSeparator();
		assert.strictEqual(s instanceof SeparatorApi, true);

		const cs = api.controller_.bladeRack.items;
		assert.strictEqual(cs[cs.length - 1] instanceof SeparatorController, true);
	});

	it('should dispose separator', () => {
		const api = createApi();
		const cs = api.controller_.bladeRack.items;

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
		assert.strictEqual(
			bapi.controller_.controller instanceof NumberTextController,
			true,
		);
	});

	it('should add monitor', () => {
		const PARAMS = {
			foo: 1,
		};
		const api = createApi();
		const bapi = api.addMonitor(PARAMS, 'foo', {
			interval: 0,
		});
		assert.strictEqual(
			bapi.controller_.controller instanceof SingleLogMonitorController,
			true,
		);
	});

	it('should listen fold event', (done) => {
		const api = createApi();
		api.on('fold', () => {
			done();
		});
		api.controller_.folder.expanded = false;
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
			expected: LabeledController,
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

				const cs = api.controller_.bladeRack.items;
				assert.strictEqual(cs[1] instanceof testCase.expected, true);
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
					assert.strictEqual(ev instanceof TpChangeEvent, true);
					assert.strictEqual(ev.target, bapi);
					assert.strictEqual(ev.presetKey, 'foo');
					assert.strictEqual(ev.value, expected);
					done();
				});
				bapi.controller_.binding.value.rawValue = params.newInternalValue;
			});

			it('should pass event for change event (global)', (done) => {
				const api = createApi();
				const obj = {foo: params.propertyValue};
				const bapi = api.addInput(obj, 'foo');

				api.on('change', (ev) => {
					assert.strictEqual(ev instanceof TpChangeEvent, true);
					assert.strictEqual(ev.presetKey, 'foo');
					assert.strictEqual(ev.value, expected);

					if (!(ev.target instanceof InputBindingApi)) {
						assert.fail('unexpected target');
					}
					assert.strictEqual(ev.target.controller_, bapi.controller_);

					done();
				});
				bapi.controller_.binding.value.rawValue = params.newInternalValue;
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
		bapi.controller_.binding.value.rawValue = 2;
	});

	it('should have right target', (done) => {
		const api = createApi();
		api.on('fold', (ev) => {
			assert.strictEqual(ev.target, api);
			done();
		});
		api.controller_.folder.expanded = !api.controller_.folder.expanded;
	});

	it('should have right target (nested)', (done) => {
		const api = createApi();
		api.addButton({title: ''});
		const subapi = api.addFolder({title: ''});

		api.on('fold', (ev) => {
			assert.strictEqual(ev.target, subapi);
			done();
		});

		subapi.controller_.folder.expanded = !subapi.controller_.folder.expanded;
	});
});
