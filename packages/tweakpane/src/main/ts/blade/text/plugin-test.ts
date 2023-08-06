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
import {TextBladeApi} from './api/text.js';
import {TextBladeParams, TextBladePlugin} from './plugin.js';

function createPluginPool(): PluginPool {
	const pool = createDefaultPluginPool();
	pool.register('test', TextBladePlugin);
	return pool;
}

describe(TextBladePlugin.id, () => {
	[
		{},
		{
			view: 'text',
		},
		{
			parser: (v: string) => v,
			view: 'text',
		},
		{
			value: '',
			view: 'text',
		},
	].forEach((params) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should not create API', () => {
				const doc = createTestWindow().document;
				const api = createBladeController(TextBladePlugin, {
					document: doc,
					params: params,
				});
				assert.strictEqual(api, null);
			});
		});
	});

	[
		(doc: Document) => createEmptyBladeController(doc),
		(doc: Document) => createLabeledValueBladeController(doc),
	].forEach((createController) => {
		it('should not create API', () => {
			const doc = createTestWindow().document;
			const c = createController(doc);
			const api = TextBladePlugin.api({
				controller: c,
				pool: createPluginPool(),
			});
			assert.strictEqual(api, null);
		});
	});

	it('should apply initial params', () => {
		const doc = createTestWindow().document;
		const formatter = (v: string) => `${v}, world`;
		const params = {
			format: formatter,
			label: 'hello',
			parse: (v: string) => v,
			value: 'hello',
			view: 'text',
		} as TextBladeParams<string>;

		const bc = createBladeController(TextBladePlugin, {
			document: doc,
			params: params,
		}) as BladeController;
		const pool = createPluginPool();
		const api = pool.createApi(bc) as TextBladeApi<string>;
		assert.strictEqual(api.formatter, formatter);
		assert.strictEqual(api.value, 'hello');
		assert.strictEqual(
			api.controller.view.element.querySelector('.tp-lblv_l')?.textContent,
			'hello',
		);
	});
});
