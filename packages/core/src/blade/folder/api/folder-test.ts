import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {Color} from '../../../input-binding/color/model/color';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createDefaultPluginPool} from '../../../plugin/plugins';
import {testBladeContainer} from '../../common/api/blade-rack-test';
import {assertUpdates} from '../../common/api/test-util';
import {TpChangeEvent, TpFoldEvent} from '../../common/api/tp-event';
import {createBlade} from '../../common/model/blade';
import {InputBindingApi} from '../../input-binding/api/input-binding';
import {FolderController} from '../controller/folder';
import {FolderPropsObject} from '../view/folder';
import {FolderApi} from './folder';

function createApi(opt_doc?: Document): FolderApi {
	const doc = opt_doc ?? createTestWindow().document;
	const c = new FolderController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<FolderPropsObject>({
			title: 'Folder',
		}),
		viewProps: ViewProps.create(),
	});
	const pool = createDefaultPluginPool();
	return new FolderApi(c, pool);
}

describe(FolderApi.name, () => {
	testBladeContainer(createApi);

	it('should have initial state', () => {
		const api = createApi();
		assert.strictEqual(api.expanded, true);
		assert.strictEqual(api.controller_.foldable.get('expanded'), true);
		assert.strictEqual(api.hidden, false);
		assert.strictEqual(api.title, 'Folder');
	});

	it('should update properties', () => {
		const api = createApi();

		assertUpdates(api);

		api.expanded = true;
		assert.strictEqual(api.controller_.foldable.get('expanded'), true);

		api.title = 'changed';
		assert.strictEqual(
			api.controller_.view.titleElement.textContent,
			'changed',
		);
	});

	it('should dispose', () => {
		const api = createApi();
		api.dispose();
		assert.strictEqual(api.controller_.viewProps.get('disposed'), true);
	});

	it('should toggle expanded when clicking title element', () => {
		const api = createApi();

		api.controller_.view.buttonElement.click();
		assert.strictEqual(api.controller_.foldable.get('expanded'), false);
	});

	it('should dispose separator', () => {
		const api = createApi();
		const cs = api.controller_.rackController.rack.children;

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
		assert.strictEqual(f.controller_.props.get('title'), 'folder');
		assert.strictEqual(f.controller_.foldable.get('expanded'), true);
	});

	it('should add collapsed folder', () => {
		const pane = createApi();
		const f = pane.addFolder({
			expanded: false,
			title: 'folder',
		});
		assert.strictEqual(f.controller_.foldable.get('expanded'), false);
	});

	it('should handle fold event', (done) => {
		const api = createApi();
		api.on('fold', (ev) => {
			assert.strictEqual(ev instanceof TpFoldEvent, true);
			assert.strictEqual(ev.expanded, false);
			done();
		});
		api.controller_.foldable.set('expanded', false);
	});

	it('should bind `this` within handler to pane', (done) => {
		const PARAMS = {foo: 1};
		const pane = createApi();
		pane.on('change', function (this: any) {
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
		assert.strictEqual(api.controller_.viewProps.get('disposed'), true);
		assert.strictEqual(i.controller_.viewProps.get('disposed'), true);
		assert.strictEqual(m.controller_.viewProps.get('disposed'), true);
	});

	it('should dispose items (nested)', () => {
		const PARAMS = {foo: 1};
		const api = createApi();
		const f = api.addFolder({title: ''});
		const i = f.addInput(PARAMS, 'foo');
		const m = f.addMonitor(PARAMS, 'foo');

		assert.strictEqual(api.controller_.viewProps.get('disposed'), false);
		assert.strictEqual(i.controller_.viewProps.get('disposed'), false);
		assert.strictEqual(m.controller_.viewProps.get('disposed'), false);
		api.dispose();
		assert.strictEqual(api.controller_.viewProps.get('disposed'), true);
		assert.strictEqual(i.controller_.viewProps.get('disposed'), true);
		assert.strictEqual(m.controller_.viewProps.get('disposed'), true);
	});

	it('should bind `this` within handler to folder', (done) => {
		const PARAMS = {foo: 1};
		const api = createApi();
		api.on('change', function (this: any) {
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
		api.controller_.foldable.set(
			'expanded',
			!api.controller_.foldable.get('expanded'),
		);
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
});
