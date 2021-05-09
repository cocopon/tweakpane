import * as assert from 'assert';
import {describe, it} from 'mocha';

import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {CheckboxController} from '../../../input-binding/boolean/controller/checkbox';
import {createTestWindow} from '../../../misc/dom-test-util';
import {forceCast} from '../../../misc/type-util';
import {createDefaultPluginPool} from '../../../plugin/plugins';
import {createBlade} from '../../common/model/blade';
import {LabeledValueController} from '../../label/controller/value-label';
import {LabelPropsObject} from '../../label/view/label';
import {TestValueBladeApi, TestValueBladePlugin} from '../../test-util';
import {RackController} from '../controller/rack';
import {RackApi} from './rack';

function createApi(opt_doc?: Document) {
	const doc = opt_doc ?? createTestWindow().document;
	const c = new RackController(doc, {
		blade: createBlade(),
		viewProps: ViewProps.create(),
	});

	const pool = createDefaultPluginPool();
	pool.register(TestValueBladePlugin);

	return new RackApi(c, pool);
}

describe(RackApi.name, () => {
	it('should handle global input events', (done) => {
		const api = createApi();
		const obj = {foo: 1};
		const bapi = api.addInput(obj, 'foo');

		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, 'foo');
			assert.strictEqual(ev.target, bapi);
			assert.strictEqual(ev.value, 2);
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
			assert.strictEqual(ev.presetKey, 'foo');
			assert.strictEqual(ev.target, bapi);
			assert.strictEqual(ev.value, 2);
			done();
		});

		const value: Value<number> = forceCast(bapi.controller_.binding.value);
		value.rawValue += 1;
	});

	it('should handle global value events', (done) => {
		const doc = createTestWindow().document;
		const api = createApi(doc);
		const c = new LabeledValueController<boolean, CheckboxController>(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: '',
			}),
			valueController: new CheckboxController(doc, {
				value: createValue<boolean>(false),
				viewProps: ViewProps.create(),
			}),
		});
		const bapi = new TestValueBladeApi(c);
		api.add(bapi);

		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, undefined);
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

		const item = api.addInput({foo: 0}, 'foo');
		(item.controller_.binding.value as Value<number>).rawValue += 1;
		api.remove(item);
		(item.controller_.binding.value as Value<number>).rawValue += 1;
		assert.strictEqual(count, 1);
	});
});
