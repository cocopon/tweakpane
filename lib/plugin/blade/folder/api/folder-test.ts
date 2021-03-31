import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBindingApi} from '../../../../api/input-binding';
import {TpChangeEvent, TpFoldEvent} from '../../../../api/tp-event';
import {TestUtil} from '../../../../misc/test-util';
import {createViewProps} from '../../../common/model/view-props';
import {Color} from '../../../input-bindings/color/model/color';
import {NumberTextController} from '../../../input-bindings/number/controller/number-text';
import {SingleLogMonitorController} from '../../../monitor-bindings/common/controller/single-log';
import {Blade} from '../../common/model/blade';
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

		api.hidden = true;
		assert.strictEqual(
			api.controller_.view.element.classList.contains('tp-v-hidden'),
			true,
		);
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

	it('should handle fold event', (done) => {
		const api = createApi();
		api.on('fold', (ev) => {
			assert.strictEqual(ev instanceof TpFoldEvent, true);
			assert.strictEqual(ev.expanded, false);
			done();
		});
		api.controller_.folder.expanded = false;
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
});
