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

import {createTestWindow} from '../../../misc/test-util.js';
import {RootController} from '../controller/root.js';
import {RootApi} from './root.js';

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
		const i1 = api.addBinding(obj, 'foo');
		const f = api.addFolder({
			title: 'folder',
		});
		const i2 = f.addBinding(obj, 'bar');
		const m1 = api.addBinding(obj, 'baz', {
			interval: 0,
			readonly: true,
		});

		obj.foo = 2;
		obj.bar = 'changed';
		obj.baz = 456;

		api.refresh();

		const vcs = {
			foo: i1.controller.valueController as NumberTextController,
			bar: i2.controller.valueController as TextController<string>,
			baz: m1.controller.valueController as SingleLogController<number>,
		};
		assert.strictEqual(vcs.foo.view.inputElement.value, '2.00', 'foo');
		assert.strictEqual(vcs.bar.view.inputElement.value, 'changed', 'bar');
		assert.strictEqual(vcs.baz.view.inputElement.value, '456.00', 'baz');
	});
});
