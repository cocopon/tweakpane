// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import RootController from '../controller/root';
import FlowUtil from '../misc/flow-util';
import TestUtil from '../misc/test-util';
import InputValue from '../model/input-value';
import RootApi from './root';

function createApi(): RootApi {
	const c = new RootController(
		TestUtil.createWindow().document,
		{},
	);
	return new RootApi(c);
}

describe(RootApi.name, () => {
	it('should handle global input events', (done) => {
		const api = createApi();
		const obj = {foo: 1};
		api.on('change', (value) => {
			assert.strictEqual(
				value,
				2,
			);
			done();
		});

		const bapi = api.addInput(obj, 'foo');
		const value: InputValue<number> = FlowUtil.forceCast(bapi.controller.binding.value);
		value.rawValue += 1;
	});

	it('should handle global input events (nested)', (done) => {
		const api = createApi();
		const obj = {foo: 1};
		api.on('change', (value) => {
			assert.strictEqual(
				value,
				2,
			);
			done();
		});

		const fapi = api.addFolder({
			title: 'foo',
		});

		const bapi = fapi.addInput(obj, 'foo');
		const value: InputValue<number> = FlowUtil.forceCast(bapi.controller.binding.value);
		value.rawValue += 1;
	});

	it('should refresh input views', () => {
		const api = createApi();
		const obj = {foo: 1, bar: 'baz'};
		const i1 = api.addInput(obj, 'foo');
		const f = api.addFolder({
			title: 'folder',
		});
		const i2 = f.addInput(obj, 'bar');

		obj.foo = 2;
		obj.bar = 'changed';

		api.refresh();

		assert.strictEqual(
			i1.controller.binding.value.rawValue,
			2,
		);
		assert.strictEqual(
			i2.controller.binding.value.rawValue,
			'changed',
		);
	});
});
