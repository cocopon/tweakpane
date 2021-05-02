import * as assert from 'assert';
import {describe, it} from 'mocha';

import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {forceCast} from '../../../misc/type-util';
import {createBlade} from '../../common/model/blade';
import {SliderApi} from '../../slider/api/slider';
import {RackController} from '../controller/rack';
import {RackApi} from './rack';

function createApi() {
	const doc = TestUtil.createWindow().document;
	const c = new RackController(doc, {
		blade: createBlade(),
		viewProps: ViewProps.create(),
	});
	return new RackApi(c);
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
		const api = createApi();
		const bapi = api.addBlade({
			max: 100,
			min: 0,
			value: 50,
			view: 'slider',
		});

		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, undefined);
			assert.strictEqual(ev.target, bapi);
			assert.strictEqual(ev.value, 55);
			done();
		});

		(bapi as SliderApi).value = 55;
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
