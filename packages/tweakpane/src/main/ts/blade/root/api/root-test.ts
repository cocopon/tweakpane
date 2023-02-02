import {
	createBlade,
	createDefaultPluginPool,
	FolderPropsObject,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';
import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../../../misc/test-util';
import {RootController} from '../controller/root';
import {RootApi} from './root';

function createApi(): RootApi {
	const c = new RootController(createTestWindow().document, {
		blade: createBlade(),
		props: ValueMap.fromObject<FolderPropsObject>({
			title: undefined,
		}),
		viewProps: ViewProps.create(),
	});
	return new RootApi(c, createDefaultPluginPool());
}

describe(RootApi.name, () => {
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

		assert.strictEqual(i1.controller_.value.rawValue, 2);
		assert.strictEqual(i2.controller_.value.rawValue, 'changed');
		assert.strictEqual(m1.controller_.value.rawValue[0], 456);
	});
});
