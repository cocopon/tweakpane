import * as assert from 'assert';
import {describe, it} from 'mocha';

import {LabelPropsObject} from '../../../common/label/view/label.js';
import {Value} from '../../../common/model/value.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {createValue} from '../../../common/model/values.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {CheckboxController} from '../../../input-binding/boolean/controller/checkbox.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {forceCast} from '../../../misc/type-util.js';
import {createDefaultPluginPool} from '../../../plugin/plugins.js';
import {PluginPool} from '../../../plugin/pool.js';
import {BindingApi} from '../../binding/api/binding.js';
import {InputBindingApi} from '../../binding/api/input-binding.js';
import {FolderApi} from '../../folder/api/folder.js';
import {LabeledValueBladeController} from '../../label/controller/value.js';
import {TestValueBladeApi, TestValueBladePlugin} from '../../test-util.js';
import {RackController} from '../controller/rack.js';
import {createBlade} from '../model/blade.js';
import {RackApi} from './rack.js';

function createApi(
	config: {
		document?: Document;
		pool?: PluginPool;
	} = {},
) {
	const doc = config.document ?? createTestWindow().document;
	const c = new RackController({
		blade: createBlade(),
		element: doc.createElement('div'),
		viewProps: ViewProps.create(),
	});

	const pool = config.pool ?? createDefaultPluginPool();
	pool.register('test', TestValueBladePlugin);

	return new RackApi(c, pool);
}

describe(RackApi.name, () => {
	it('should handle global input events', (done) => {
		const api = createApi();
		const obj = {foo: 1};
		const bapi = api.addBinding(obj, 'foo');

		api.on('change', (ev) => {
			assert.strictEqual((ev.target as BindingApi).key, 'foo');
			assert.strictEqual(ev.target, bapi);
			assert.strictEqual(ev.value, 2);
			done();
		});

		const value: Value<number> = forceCast(bapi.controller.value);
		value.rawValue += 1;
	});

	it('should handle global input events (nested)', (done) => {
		const api = createApi();
		const obj = {foo: 1};
		const fapi = api.addFolder({
			title: 'foo',
		});
		const bapi = fapi.addBinding(obj, 'foo');

		api.on('change', (ev) => {
			assert.strictEqual((ev.target as BindingApi).key, 'foo');
			assert.strictEqual(ev.target, bapi);
			assert.strictEqual(ev.value, 2);
			done();
		});

		const value: Value<number> = forceCast(bapi.controller.value);
		value.rawValue += 1;
	});

	it('should handle global value events', (done) => {
		const doc = createTestWindow().document;
		const pool = createDefaultPluginPool();
		const api = createApi({
			document: doc,
			pool: pool,
		});
		const v = createValue<boolean>(false);
		const c = new LabeledValueBladeController<boolean, CheckboxController>(
			doc,
			{
				blade: createBlade(),
				props: ValueMap.fromObject<LabelPropsObject>({
					label: '',
				}),
				value: v,
				valueController: new CheckboxController(doc, {
					value: v,
					viewProps: ViewProps.create(),
				}),
			},
		);
		const bapi = pool.createApi(c) as TestValueBladeApi;
		api.add(bapi);

		api.on('change', (ev) => {
			assert.strictEqual(ev.target, bapi);
			assert.strictEqual(ev.value, true);
			done();
		});

		bapi.value = true;
	});

	it('should not handle removed child events', () => {
		const api = createApi();

		let count = 0;
		api.on('change', () => {
			count += 1;
		});

		const item = api.addBinding({foo: 0}, 'foo');
		(item.controller.value as Value<number>).rawValue += 1;
		api.remove(item);
		(item.controller.value as Value<number>).rawValue += 1;
		assert.strictEqual(count, 1);
	});

	it('should have right target for nested racks', (done) => {
		const doc = createTestWindow().document;
		const pool = createDefaultPluginPool();
		const api1 = createApi({
			document: doc,
			pool: pool,
		});
		const f = api1.addFolder({title: ''});
		const b = f.addBinding({foo: 1}, 'foo');
		const api2 = createApi({
			document: doc,
			pool: pool,
		});
		api2.add(f);

		api2.on('change', (ev) => {
			assert.strictEqual(ev.target, b);
			done();
		});

		b.controller.value.rawValue = 2;
	});

	it('should unlisten change event', () => {
		const api = createApi();
		const obj = {foo: 1};
		const bapi = api.addBinding(obj, 'foo');
		const handler = () => {
			assert.fail('should not be called');
		};
		api.on('change', handler);
		api.off('change', handler);

		const value: Value<number> = forceCast(bapi.controller.value);
		value.rawValue += 1;
	});

	it('should refresh children', () => {
		const doc = createTestWindow().document;
		const api = createApi({document: doc});
		const obj = {foo: 1};
		api.addBinding(obj, 'foo');
		obj.foo = 2;

		const bapi = api.children[0] as InputBindingApi;
		assert.strictEqual(bapi.controller.value.rawValue, 1);
		api.refresh();
		assert.strictEqual(bapi.controller.value.rawValue, 2);
	});

	it('should refresh nested children', () => {
		const doc = createTestWindow().document;
		const api = createApi({document: doc});
		const obj = {foo: 1};
		api.addFolder({title: ''}).addBinding(obj, 'foo');
		obj.foo = 2;

		const fapi = api.children[0] as FolderApi;
		const bapi = fapi.children[0] as InputBindingApi;
		assert.strictEqual(bapi.controller.value.rawValue, 1);
		api.refresh();
		assert.strictEqual(bapi.controller.value.rawValue, 2);
	});
});
