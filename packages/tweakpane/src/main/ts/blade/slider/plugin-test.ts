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
	createEmptyLabelableController,
	createLabelController,
	createTestWindow,
} from '../../misc/test-util';
import {SliderBladeApi} from './api/slider';
import {SliderBladeParams, SliderBladePlugin} from './plugin';

function createPluginPool(): PluginPool {
	const pool = createDefaultPluginPool();
	pool.register(SliderBladePlugin);
	return pool;
}

describe(SliderBladePlugin.id, () => {
	[
		{},
		{
			view: 'slider',
		},
		{
			min: 0,
			view: 'slider',
		},
		{
			max: 100,
			view: 'slider',
		},
	].forEach((params) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should not create API', () => {
				const doc = createTestWindow().document;
				const api = createBladeController(SliderBladePlugin, {
					document: doc,
					params: params,
				});
				assert.strictEqual(api, null);
			});
		});
	});

	[
		(doc: Document) => createEmptyBladeController(doc),
		(doc: Document) =>
			createLabelController(doc, createEmptyLabelableController(doc)),
	].forEach((createController) => {
		it('should not create API', () => {
			const doc = createTestWindow().document;
			const c = createController(doc);
			const api = SliderBladePlugin.api({
				controller: c,
				pool: createPluginPool(),
			});
			assert.strictEqual(api, null);
		});
	});

	it('should apply initial params', () => {
		const doc = createTestWindow().document;
		const formatter = (v: number) => `${v}px`;
		const bc = createBladeController(SliderBladePlugin, {
			document: doc,
			params: {
				format: formatter,
				label: 'hello',
				max: 100,
				min: -100,
				value: 50,
				view: 'slider',
			} as SliderBladeParams,
		}) as BladeController;
		const pool = createPluginPool();
		const api = pool.createBladeApi(bc) as SliderBladeApi;

		assert.strictEqual(api.maxValue, 100);
		assert.strictEqual(api.minValue, -100);
		assert.strictEqual(api.value, 50);

		assert.strictEqual(
			api.controller_.view.element.querySelector('.tp-lblv_l')?.textContent,
			'hello',
		);
	});
});
