import * as assert from 'assert';
import {describe} from 'mocha';

import {Value} from '../../../common/model/value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {createDefaultPluginPool} from '../../../plugin/plugins.js';
import {BindingApi} from '../../binding/api/binding.js';
import {TpChangeEvent} from '../../common/api/tp-event.js';
import {createBlade} from '../../common/model/blade.js';
import {TabController} from '../controller/tab.js';
import {TabApi} from './tab.js';

describe(TabApi.name, () => {
	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pool = createDefaultPluginPool();
		const api = new TabApi(c, pool);
		assert.deepStrictEqual(api.pages, []);
	});

	it('should add page', () => {
		const doc = createTestWindow().document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pool = createDefaultPluginPool();
		const api = new TabApi(c, pool);
		const papi1 = api.addPage({title: 'foo'});
		assert.strictEqual(api.pages[0], papi1);
		assert.strictEqual(papi1.title, 'foo');

		const papi2 = api.addPage({title: 'bar'});
		assert.strictEqual(api.pages[1], papi2);
	});

	it('should insert page', () => {
		const doc = createTestWindow().document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pool = createDefaultPluginPool();
		const api = new TabApi(c, pool);
		api.addPage({title: 'foo'});

		const papi = api.addPage({title: 'bar', index: 0});
		assert.strictEqual(api.pages[0], papi);
	});

	it('should remove page', () => {
		const doc = createTestWindow().document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pool = createDefaultPluginPool();
		const api = new TabApi(c, pool);
		api.addPage({title: 'foo'});
		const papi = api.addPage({title: 'bar'});
		api.addPage({title: 'baz'});

		api.removePage(1);
		assert.strictEqual(api.pages.length, 2);
		assert.notStrictEqual(api.pages[1], papi);
	});

	it('should handle global input events', (done) => {
		const doc = createTestWindow().document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pool = createDefaultPluginPool();
		const api = new TabApi(c, pool);
		api.addPage({title: ''});
		api.addPage({title: ''});
		const bapi = api.pages[1].addBinding({foo: 1}, 'foo');

		api.on('change', (ev) => {
			assert.strictEqual(ev instanceof TpChangeEvent, true);
			assert.strictEqual((ev.target as BindingApi).key, 'foo');
			assert.strictEqual(ev.value, 2);

			if (!(ev.target instanceof BindingApi)) {
				assert.fail('unexpected target');
			}
			assert.strictEqual(ev.target.controller, bapi.controller);

			done();
		});

		const value = bapi.controller.value as Value<number>;
		value.rawValue += 1;
	});

	it('should handle global input events (nested)', (done) => {
		const doc = createTestWindow().document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pool = createDefaultPluginPool();
		const api = new TabApi(c, pool);
		api.addPage({title: ''});
		api.addPage({title: ''});
		const tapi = api.pages[1].addBlade({
			pages: [{title: ''}, {title: ''}],
			view: 'tab',
		}) as TabApi;
		const bapi = tapi.pages[1].addBinding({foo: 1}, 'foo');

		api.on('change', (ev) => {
			assert.strictEqual(ev instanceof TpChangeEvent, true);
			assert.strictEqual((ev.target as BindingApi).key, 'foo');
			assert.strictEqual(ev.value, 2);

			if (!(ev.target instanceof BindingApi)) {
				assert.fail('unexpected target');
			}
			assert.strictEqual(ev.target.controller, bapi.controller);

			done();
		});

		const value = bapi.controller.value as Value<number>;
		value.rawValue += 1;
	});

	it('should unlisten event', () => {
		const doc = createTestWindow().document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pool = createDefaultPluginPool();
		const api = new TabApi(c, pool);
		api.addPage({title: ''});
		const bapi = api.pages[0].addBinding({foo: 1}, 'foo');

		const handler = () => {
			assert.fail('should not be called');
		};
		api.on('change', handler);
		api.off('change', handler);

		const value = bapi.controller.value as Value<number>;
		value.rawValue += 1;
	});

	it('should emit select event', () => {
		const doc = createTestWindow().document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pool = createDefaultPluginPool();
		const api = new TabApi(c, pool);
		api.addPage({title: 'foo'});
		api.addPage({title: 'bar'});
		api.addPage({title: 'baz'});

		const selectedIndexes: number[] = [];
		api.on('select', (ev) => {
			selectedIndexes.push(ev.index);
		});
		api.pages[1].selected = true;
		api.pages[2].selected = true;
		api.pages[0].selected = true;
		assert.deepStrictEqual(selectedIndexes, [1, 2, 0]);
	});

	it('should refresh pages', () => {
		const doc = createTestWindow().document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pool = createDefaultPluginPool();
		const api = new TabApi(c, pool);
		api.addPage({title: 'foo'});
		api.addPage({title: 'bar'});

		const PARAMS = {param: 1};
		const i0 = api.pages[0].addBinding(PARAMS, 'param');
		const i1 = api.pages[1].addBinding(PARAMS, 'param');
		PARAMS.param += 1;
		api.refresh();

		assert.strictEqual(i0.controller.value.rawValue, 2);
		assert.strictEqual(i1.controller.value.rawValue, 2);
	});
});
