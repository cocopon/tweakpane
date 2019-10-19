import {assert} from 'chai';
import {describe, it} from 'mocha';

import {RootController} from '../controller/root';
import {TestUtil} from '../misc/test-util';
import {TypeUtil} from '../misc/type-util';
import {InputValue} from '../model/input-value';
import {RootApi} from './root';

function createApi(): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {
		title: 'Tweakpane',
	});
	return new RootApi(c);
}

describe(RootApi.name, () => {
	it('should dispose', () => {
		const api = createApi();
		api.dispose();
		assert.strictEqual(api.controller.view.disposed, true);
	});

	it('should handle global input events', (done) => {
		const api = createApi();
		const obj = {foo: 1};
		api.on('change', (v) => {
			assert.strictEqual(v, 2);
			done();
		});

		const bapi = api.addInput(obj, 'foo');
		const value: InputValue<number> = TypeUtil.forceCast(
			bapi.controller.binding.value,
		);
		value.rawValue += 1;
	});

	it('should handle global input events (nested)', (done) => {
		const api = createApi();
		const obj = {foo: 1};
		api.on('change', (v) => {
			assert.strictEqual(v, 2);
			done();
		});

		const fapi = api.addFolder({
			title: 'foo',
		});

		const bapi = fapi.addInput(obj, 'foo');
		const value: InputValue<number> = TypeUtil.forceCast(
			bapi.controller.binding.value,
		);
		value.rawValue += 1;
	});

	it('should refresh views', () => {
		const api = createApi();
		const obj = {
			bar: 'bar',
			baz: 123,
			foo: 1,
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
			bar: 'hello',
			baz: 2,
			foo: 1,
		};
		const api = createApi();
		api.addInput(PARAMS, 'foo');
		api.addInput(PARAMS, 'bar');
		api.addMonitor(PARAMS, 'baz', {
			interval: 0,
		});
		const preset = api.exportPreset();
		assert.deepStrictEqual(preset, {
			bar: 'hello',
			foo: 1,
		});
	});

	it('should import preset', () => {
		const PARAMS = {
			bar: 'hello',
			foo: 1,
		};
		const api = createApi();
		api.addInput(PARAMS, 'foo');
		api.addInput(PARAMS, 'bar');

		api.importPreset({
			bar: 'world',
			foo: 123,
		});

		assert.deepStrictEqual(PARAMS, {
			bar: 'world',
			foo: 123,
		});
	});

	it('should get element', () => {
		const api = createApi();
		assert.exists(api.element);
	});
});
