import {
	BladeController,
	createBladeController,
	createDefaultPluginPool,
	PluginPool,
} from '@tweakpane/core';
import * as assert from 'assert';
import {describe, it} from 'mocha';

import {
	createEmptyBladeController,
	createLabeledValueBladeController,
	createTestWindow,
} from '../../misc/test-util.js';
import {ListBladeApi} from './api/list.js';
import {ListBladeParams, ListBladePlugin} from './plugin.js';

function createPluginPool(): PluginPool {
	const pool = createDefaultPluginPool();
	pool.register('test', ListBladePlugin);
	return pool;
}

describe(ListBladePlugin.id, () => {
	[
		{},
		{
			view: 'list',
		},
		{
			value: 123,
			view: 'list',
		},
		{
			options: {foo: 1},
			view: 'list',
		},
		{
			value: 123,
			options: 'invalid',
			view: 'list',
		},
	].forEach((params) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should not create API', () => {
				const doc = createTestWindow().document;
				const api = createBladeController(ListBladePlugin, {
					document: doc,
					params: params,
				});
				assert.strictEqual(api, null);
			});
		});
	});

	[
		{
			value: 0,
			options: [],
			view: 'list',
		},
	].forEach((params) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should create API', () => {
				const doc = createTestWindow().document;
				const api = createBladeController(ListBladePlugin, {
					document: doc,
					params: params,
				});
				assert.notStrictEqual(api, null);
			});
		});
	});

	[
		(doc: Document) => createEmptyBladeController(doc),
		(doc: Document) => createLabeledValueBladeController(doc),
	].forEach((createController) => {
		it('should not create API', () => {
			const doc = createTestWindow().document;
			const c = createController(doc) as BladeController;
			const api = ListBladePlugin.api({
				controller: c,
				pool: createPluginPool(),
			});
			assert.strictEqual(api, null);
		});
	});

	it('should apply initial params', () => {
		const doc = createTestWindow().document;
		const bc = createBladeController(ListBladePlugin, {
			document: doc,
			params: {
				label: 'hello',
				options: {
					foo: 1,
					bar: 2,
				},
				value: 123,
				view: 'list',
			} as ListBladeParams<number>,
		}) as BladeController;
		const pool = createPluginPool();
		const api = pool.createApi(bc) as ListBladeApi<number>;

		assert.strictEqual(api.value, 123);
		assert.deepStrictEqual(api.options[0], {text: 'foo', value: 1});
		assert.deepStrictEqual(api.options[1], {text: 'bar', value: 2});
		assert.strictEqual(
			api.controller.view.element.querySelector('.tp-lblv_l')?.textContent,
			'hello',
		);
	});

	it('should support complex value', () => {
		const doc = createTestWindow().document;
		const bc = createBladeController(ListBladePlugin, {
			document: doc,
			params: {
				label: 'hello',
				options: [
					{text: 'foo', value: {id: 'foo'}},
					{text: 'bar', value: {id: 'bar'}},
				],
				value: {id: 'foo'},
				view: 'list',
			} as ListBladeParams<{id: string}>,
		}) as BladeController;
		const pool = createPluginPool();
		const api = pool.createApi(bc) as ListBladeApi<{id: string}>;

		const selectElem = api.controller.valueController.view.selectElement;
		assert.strictEqual(
			(selectElem.querySelector('option') as HTMLOptionElement).value,
			'foo',
		);
		assert.strictEqual(
			(selectElem.querySelector('option:nth-child(2)') as HTMLOptionElement)
				.value,
			'bar',
		);
	});
});
