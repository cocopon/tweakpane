import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {IntColor} from '../../../input-binding/color/model/int-color.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {createDefaultPluginPool} from '../../../plugin/plugins.js';
import {BindingApi} from '../../binding/api/binding.js';
import {testBladeContainer} from '../../common/api/container-test.js';
import {assertUpdates} from '../../common/api/test-util.js';
import {TpChangeEvent, TpFoldEvent} from '../../common/api/tp-event.js';
import {createBlade} from '../../common/model/blade.js';
import {TestValueBladePlugin} from '../../test-util.js';
import {FolderController} from '../controller/folder.js';
import {FolderPropsObject} from '../view/folder.js';
import {FolderApi} from './folder.js';

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
	pool.register('test', TestValueBladePlugin);
	return new FolderApi(c, pool);
}

describe(FolderApi.name, () => {
	testBladeContainer(createApi);

	it('should have initial state', () => {
		const api = createApi();
		assert.strictEqual(api.expanded, true);
		assert.strictEqual(api.controller.foldable.get('expanded'), true);
		assert.strictEqual(api.hidden, false);
		assert.strictEqual(api.title, 'Folder');
	});

	it('should update properties', () => {
		const api = createApi();

		assertUpdates(api);

		api.expanded = true;
		assert.strictEqual(api.controller.foldable.get('expanded'), true);

		api.title = 'changed';
		assert.strictEqual(api.controller.view.titleElement.textContent, 'changed');
	});

	it('should dispose', () => {
		const api = createApi();
		api.dispose();
		assert.strictEqual(api.controller.viewProps.get('disposed'), true);
	});

	it('should toggle expanded when clicking title element', () => {
		const api = createApi();

		api.controller.view.buttonElement.click();
		assert.strictEqual(api.controller.foldable.get('expanded'), false);
	});

	it('should add folder', () => {
		const pane = createApi();
		const f = pane.addFolder({
			title: 'folder',
		});
		assert.strictEqual(f.controller.props.get('title'), 'folder');
		assert.strictEqual(f.controller.foldable.get('expanded'), true);
	});

	it('should add collapsed folder', () => {
		const pane = createApi();
		const f = pane.addFolder({
			expanded: false,
			title: 'folder',
		});
		assert.strictEqual(f.controller.foldable.get('expanded'), false);
	});

	it('should handle fold event', (done) => {
		const api = createApi();
		api.on('fold', (ev) => {
			assert.strictEqual(ev instanceof TpFoldEvent, true);
			assert.strictEqual(ev.expanded, false);
			done();
		});
		api.controller.foldable.set('expanded', false);
	});

	it('should bind `this` within handler to pane', (done) => {
		const PARAMS = {foo: 1};
		const pane = createApi();
		pane.on('change', function (this: any) {
			assert.strictEqual(this, pane);
			done();
		});

		const bapi = pane.addBinding(PARAMS, 'foo');
		bapi.controller.value.rawValue = 2;
	});

	it('should dispose items', () => {
		const PARAMS = {foo: 1};
		const api = createApi();
		const i = api.addBinding(PARAMS, 'foo');
		const m = api.addBinding(PARAMS, 'foo', {readonly: true});

		api.dispose();
		assert.strictEqual(api.controller.viewProps.get('disposed'), true);
		assert.strictEqual(i.controller.viewProps.get('disposed'), true);
		assert.strictEqual(m.controller.viewProps.get('disposed'), true);
	});

	it('should dispose items (nested)', () => {
		const PARAMS = {foo: 1};
		const api = createApi();
		const f = api.addFolder({title: ''});
		const i = f.addBinding(PARAMS, 'foo');
		const m = f.addBinding(PARAMS, 'foo', {readonly: true});

		assert.strictEqual(api.controller.viewProps.get('disposed'), false);
		assert.strictEqual(i.controller.viewProps.get('disposed'), false);
		assert.strictEqual(m.controller.viewProps.get('disposed'), false);
		api.dispose();
		assert.strictEqual(api.controller.viewProps.get('disposed'), true);
		assert.strictEqual(i.controller.viewProps.get('disposed'), true);
		assert.strictEqual(m.controller.viewProps.get('disposed'), true);
	});

	it('should bind `this` within handler to folder', (done) => {
		const PARAMS = {foo: 1};
		const api = createApi();
		api.on('change', function (this: any) {
			assert.strictEqual(this, api);
			done();
		});

		const bapi = api.addBinding(PARAMS, 'foo');
		bapi.controller.value.rawValue = 2;
	});

	it('should have right target', (done) => {
		const api = createApi();
		api.on('fold', (ev) => {
			assert.strictEqual(ev.target, api);
			done();
		});
		api.controller.foldable.set(
			'expanded',
			!api.controller.foldable.get('expanded'),
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
				newInternalValue: new IntColor([0x22, 0x44, 0x88], 'rgb'),
			},
		},
		{
			expected: 'rgb(0, 127, 255)',
			params: {
				propertyValue: 'rgb(10, 20, 30)',
				newInternalValue: new IntColor([0, 127, 255], 'rgb'),
			},
		},
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should pass event for change event (local)', (done) => {
				const api = createApi();
				const obj = {foo: params.propertyValue};
				const bapi = api.addBinding(obj, 'foo');

				bapi.on('change', (ev) => {
					assert.strictEqual(ev instanceof TpChangeEvent, true);
					assert.strictEqual(ev.target, bapi);
					assert.strictEqual(ev.target.key, 'foo');
					assert.strictEqual(ev.value, expected);
					done();
				});
				bapi.controller.value.rawValue = params.newInternalValue;
			});

			it('should pass event for change event (global)', (done) => {
				const api = createApi();
				const obj = {foo: params.propertyValue};
				const bapi = api.addBinding(obj, 'foo');

				api.on('change', (ev) => {
					assert.strictEqual(ev instanceof TpChangeEvent, true);
					assert.strictEqual((ev.target as BindingApi).key, 'foo');
					assert.strictEqual(ev.value, expected);

					if (!(ev.target instanceof BindingApi)) {
						assert.fail('unexpected target');
					}
					assert.strictEqual(ev.target.controller, bapi.controller);

					done();
				});
				bapi.controller.value.rawValue = params.newInternalValue;
			});
		});
	});

	it('should unlisten event', () => {
		const api = createApi();
		const obj = {foo: 1};
		const bapi = api.addBinding(obj, 'foo');
		const handler = () => {
			assert.fail('should not be called');
		};
		api.on('change', handler);
		api.off('change', handler);
		bapi.controller.value.rawValue = 2;
	});

	it('should refresh items', () => {
		const api = createApi();
		const PARAMS = {param: 1};
		const i = api.addBinding(PARAMS, 'param');
		PARAMS.param += 1;
		api.refresh();
		assert.strictEqual(i.controller.value.rawValue, 2);
	});
});
