import {
	createBlade,
	createDefaultPluginPool,
	FolderPropsObject,
	NumberTextController,
	SingleLogController,
	TextController,
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
			foo: 1,
			bar: 'hello',
		});
	});

	it('should apply imported preset to target', () => {
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

	it('should apply imported preset to views', () => {
		const PARAMS = {
			foo: 1,
			bar: 'hello',
		};
		const api = createApi();
		const i1 = api.addInput(PARAMS, 'foo');
		const i2 = api.addInput(PARAMS, 'bar');

		api.importPreset({
			foo: 123,
			bar: 'world',
		});

		const vcs = {
			foo: i1.controller_.valueController as NumberTextController,
			bar: i2.controller_.valueController as TextController<string>,
		};
		assert.strictEqual(vcs.foo.view.inputElement.value, '123.00');
		assert.strictEqual(vcs.bar.view.inputElement.value, 'world');
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

		const vcs = {
			foo: i1.controller_.valueController as NumberTextController,
			bar: i2.controller_.valueController as TextController<string>,
			baz: m1.controller_.valueController as SingleLogController<number>,
		};
		assert.strictEqual(vcs.foo.view.inputElement.value, '2.00', 'foo');
		assert.strictEqual(vcs.bar.view.inputElement.value, 'changed', 'bar');
		assert.strictEqual(vcs.baz.view.inputElement.value, '456.00', 'baz');
	});
});
