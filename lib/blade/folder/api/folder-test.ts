import * as assert from 'assert';
import {describe, it} from 'mocha';

import {Value} from '../../../common/model/value';
import {createViewProps} from '../../../common/model/view-props';
import {NumberTextController} from '../../../common/number/controller/number-text';
import {Color} from '../../../input-binding/color/model/color';
import {TestUtil} from '../../../misc/test-util';
import {forceCast} from '../../../misc/type-util';
import {SingleLogMonitorController} from '../../../monitor-binding/common/controller/single-log';
import {ButtonApi} from '../../button/api/button';
import {InputBindingApi} from '../../common/api/input-binding';
import {assertUpdates} from '../../common/api/test-util';
import {TpChangeEvent, TpFoldEvent} from '../../common/api/tp-event';
import {InputBindingController} from '../../common/controller/input-binding';
import {MonitorBindingController} from '../../common/controller/monitor-binding';
import {Blade} from '../../common/model/blade';
import {LabeledController} from '../../labeled/controller';
import {SeparatorApi} from '../../separator/api/separator';
import {SeparatorController} from '../../separator/controller';
import {FolderController} from '../controller/folder';
import {FolderApi} from './folder';

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
	it('should have initial state', () => {
		const api = createApi();
		assert.strictEqual(api.controller_.folder.expanded, true);
		assert.strictEqual(api.hidden, false);
	});

	it('should update properties', () => {
		const api = createApi();

		api.expanded = true;
		assert.strictEqual(api.controller_.folder.expanded, true);

		assertUpdates(api);
	});

	it('should dispose', () => {
		const api = createApi();
		api.dispose();
		assert.strictEqual(api.controller_.blade.disposed, true);
	});

	it('should toggle expanded when clicking title element', () => {
		const api = createApi();

		api.controller_.view.titleElement.click();
		assert.strictEqual(api.controller_.folder.expanded, false);
	});

	it('should add input', () => {
		const PARAMS = {
			foo: 1,
		};
		const api = createApi();
		const bapi = api.addInput(PARAMS, 'foo');
		assert.strictEqual(
			bapi.controller_.valueController instanceof NumberTextController,
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
			bapi.controller_.valueController instanceof SingleLogMonitorController,
			true,
		);
	});

	it('should add button', () => {
		const api = createApi();
		const bapi = api.addButton({
			title: '',
		});
		assert.strictEqual(bapi instanceof ButtonApi, true);
	});

	it('should add separator', () => {
		const api = createApi();
		const s = api.addSeparator();
		assert.strictEqual(s instanceof SeparatorApi, true);
	});

	it('should dispose separator', () => {
		const api = createApi();
		const cs = api.controller_.bladeRack.children;

		const s = api.addSeparator();
		assert.strictEqual(cs.length, 1);
		s.dispose();
		assert.strictEqual(cs.length, 0);
	});

	it('should add folder', () => {
		const pane = createApi();
		const f = pane.addFolder({
			title: 'folder',
		});
		assert.strictEqual(f.controller_.folder.title, 'folder');
		assert.strictEqual(f.controller_.folder.expanded, true);
	});

	it('should add collapsed folder', () => {
		const pane = createApi();
		const f = pane.addFolder({
			expanded: false,
			title: 'folder',
		});
		assert.strictEqual(f.controller_.folder.expanded, false);
	});

	it('should handle fold event', (done) => {
		const api = createApi();
		api.on('fold', (ev) => {
			assert.strictEqual(ev instanceof TpFoldEvent, true);
			assert.strictEqual(ev.expanded, false);
			done();
		});
		api.controller_.folder.expanded = false;
	});

	it('should handle fold events (nested)', (done) => {
		const api = createApi();
		const f = api.addFolder({
			title: 'folder',
		});

		api.on('fold', (ev) => {
			assert.strictEqual(ev instanceof TpFoldEvent, true);
			assert.strictEqual(ev.expanded, false);
			done();
		});
		f.expanded = false;
	});

	it('should handle global input events', (done) => {
		const api = createApi();
		const obj = {foo: 1};
		const bapi = api.addInput(obj, 'foo');

		api.on('change', (ev) => {
			assert.strictEqual(ev instanceof TpChangeEvent, true);
			assert.strictEqual(ev.presetKey, 'foo');
			assert.strictEqual(ev.value, 2);

			if (!(ev.target instanceof InputBindingApi)) {
				assert.fail('unexpected target');
			}
			assert.strictEqual(ev.target.controller_, bapi.controller_);

			done();
		});

		const value: Value<number> = forceCast(bapi.controller_.binding.value);
		value.rawValue += 1;
	});

	it('should handle global input events (nested)', (done) => {
		const api = createApi();
		const obj = {foo: 1};
		const fapi = api.addFolder({
			title: 'foo',
		});
		const bapi = fapi.addInput(obj, 'foo');

		api.on('change', (ev) => {
			assert.strictEqual(ev instanceof TpChangeEvent, true);
			assert.strictEqual(ev.presetKey, 'foo');
			assert.strictEqual(ev.value, 2);

			if (!(ev.target instanceof InputBindingApi)) {
				assert.fail('unexpected target');
			}
			assert.strictEqual(ev.target.controller_, bapi.controller_);

			done();
		});

		const value: Value<number> = forceCast(bapi.controller_.binding.value);
		value.rawValue += 1;
	});

	it('should bind `this` within handler to pane', (done) => {
		const PARAMS = {foo: 1};
		const pane = createApi();
		pane.on('change', function(this: any) {
			assert.strictEqual(this, pane);
			done();
		});

		const bapi = pane.addInput(PARAMS, 'foo');
		bapi.controller_.binding.value.rawValue = 2;
	});

	it('should dispose items', () => {
		const PARAMS = {foo: 1};
		const api = createApi();
		const i = api.addInput(PARAMS, 'foo');
		const m = api.addMonitor(PARAMS, 'foo');

		api.dispose();
		assert.strictEqual(api.controller_.blade.disposed, true);
		assert.strictEqual(i.controller_.blade.disposed, true);
		assert.strictEqual(m.controller_.blade.disposed, true);
	});

	it('should dispose items (nested)', () => {
		const PARAMS = {foo: 1};
		const api = createApi();
		const f = api.addFolder({title: ''});
		const i = f.addInput(PARAMS, 'foo');
		const m = f.addMonitor(PARAMS, 'foo');

		assert.strictEqual(api.controller_.blade.disposed, false);
		assert.strictEqual(i.controller_.blade.disposed, false);
		assert.strictEqual(m.controller_.blade.disposed, false);
		api.dispose();
		assert.strictEqual(api.controller_.blade.disposed, true);
		assert.strictEqual(i.controller_.blade.disposed, true);
		assert.strictEqual(m.controller_.blade.disposed, true);
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

				const cs = api.controller_.bladeRack.children;
				assert.strictEqual(cs[1] instanceof testCase.expected, true);
			});
		});
	});

	it('should get children', () => {
		const api = createApi();
		const items = [
			api.addInput({foo: 0}, 'foo'),
			api.addInput({bar: 1}, 'bar'),
			api.addInput({baz: 2}, 'baz'),
		];

		assert.strictEqual(api.children.length, 3);
		assert.strictEqual(api.children[0], items[0]);
		assert.strictEqual(api.children[1], items[1]);
		assert.strictEqual(api.children[2], items[2]);
	});

	it('should remove child', () => {
		const api = createApi();
		const items = [
			api.addInput({foo: 0}, 'foo'),
			api.addInput({bar: 1}, 'bar'),
			api.addInput({baz: 2}, 'baz'),
		];

		api.remove(items[1]);
		assert.strictEqual(api.children.length, 2);
		assert.strictEqual(api.children[0], items[0]);
		assert.strictEqual(api.children[1], items[2]);
	});

	it('should not handle removed child events', () => {
		const api = createApi();

		let count = 0;
		api.on('change', () => {
			count += 1;
		});

		const item = api.addInput({foo: 0}, 'foo');
		(item.controller_.binding.value as Value<number>).rawValue += 1;
		api.remove(item);
		(item.controller_.binding.value as Value<number>).rawValue += 1;
		assert.strictEqual(count, 1);
	});
});
