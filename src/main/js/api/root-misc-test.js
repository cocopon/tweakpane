// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import RootController from '../controller/root';
import FlowUtil from '../misc/flow-util';
import TestUtil from '../misc/test-util';
import InputValue from '../model/input-value';
import RootApi from './root';

function createApi(): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {
		title: 'Tweakpane',
	});
	return new RootApi(c);
}

describe(RootApi.name, () => {
	it('should handle global input events', (done) => {
		const api = createApi();
		const obj = {foo: 1};
		api.on('change', (value) => {
			assert.strictEqual(value, 2);
			done();
		});

		const bapi = api.addInput(obj, 'foo');
		const value: InputValue<number> = FlowUtil.forceCast(
			bapi.controller.binding.value,
		);
		value.rawValue += 1;
	});

	it('should handle global input events (nested)', (done) => {
		const api = createApi();
		const obj = {foo: 1};
		api.on('change', (value) => {
			assert.strictEqual(value, 2);
			done();
		});

		const fapi = api.addFolder({
			title: 'foo',
		});

		const bapi = fapi.addInput(obj, 'foo');
		const value: InputValue<number> = FlowUtil.forceCast(
			bapi.controller.binding.value,
		);
		value.rawValue += 1;
	});

	it('should refresh views', () => {
		const api = createApi();
		const obj = {
			foo: 1,
			bar: 'bar',
			baz: 123,
		};
		const i1 = api.addInput(obj, 'foo');
		const f = api.addFolder({
			title: 'folder',
		});
		const i2 = f.addInput(obj, 'bar');
		const m1 = api.addMonitor(obj, 'baz', {
			interval: 0,
		});

		obj.foo = 2;
		obj.bar = 'changed';
		obj.baz = 456;

		api.refresh();

		assert.strictEqual(i1.controller.binding.value.rawValue, 2);
		assert.strictEqual(i2.controller.binding.value.rawValue, 'changed');
		assert.strictEqual(m1.controller.binding.value.rawValues[0], 456);
	});

	it('should get expanded', () => {
		const api = createApi();
		const folder = api.controller.folder;

		if (folder) {
			folder.expanded = false;
		}
		assert.strictEqual(api.expanded, false);
		if (folder) {
			folder.expanded = true;
		}
		assert.strictEqual(api.expanded, true);
	});

	it('should set expanded', () => {
		const api = createApi();
		const folder = api.controller.folder;

		api.expanded = false;
		assert.strictEqual(folder && folder.expanded, false);
		api.expanded = true;
		assert.strictEqual(folder && folder.expanded, true);
	});

	it('should export inputs as preset', () => {
		const PARAMS = {
			foo: 1,
			bar: 'hello',
			baz: 2,
		};
		const api = createApi();
		api.addInput(PARAMS, 'foo');
		api.addInput(PARAMS, 'bar');
		api.addMonitor(PARAMS, 'baz', {
			interval: 0,
		});
		const preset = api.exportPreset();
		assert.deepStrictEqual(preset, {
			foo: 1,
			bar: 'hello',
		});
	});

	it('should import preset', () => {
		const PARAMS = {
			foo: 1,
			bar: 'hello',
		};
		const api = createApi();
		api.addInput(PARAMS, 'foo');
		api.addInput(PARAMS, 'bar');

		api.importPreset({
			foo: 123,
			bar: 'world',
		});

		assert.deepStrictEqual(PARAMS, {
			foo: 123,
			bar: 'world',
		});
	});

	it('should get element', () => {
		const api = createApi();
		assert.exists(api.element);
	});
});
