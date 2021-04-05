import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {Blade} from '../../common/model/blade';
import {RootController} from '../controller/root';
import {RootApi} from './root';

function createApi(): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {
		blade: new Blade(),
		props: new ValueMap({
			title: undefined as string | undefined,
		}),
		viewProps: createViewProps(),
	});
	return new RootApi(c);
}

describe(RootApi.name, () => {
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
		assert.ok(api.element);
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

		assert.strictEqual(i1.controller_.binding.value.rawValue, 2);
		assert.strictEqual(i2.controller_.binding.value.rawValue, 'changed');
		assert.strictEqual(m1.controller_.binding.value.rawValue[0], 456);
	});
});
