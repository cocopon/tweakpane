import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {forceCast} from '../../misc/type-util';
import {createBladeApi} from '../common/api/plugins';
import {createBladeController} from '../plugin';
import {
	createEmptyBladeController,
	createEmptyLabelableController,
	createLabelController,
} from '../test-util';
import {SliderApi} from './api/slider';
import {SliderBladeParams, SliderBladePlugin} from './plugin';

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
				const doc = TestUtil.createWindow().document;
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
			const doc = TestUtil.createWindow().document;
			const c = createController(doc);
			const api = SliderBladePlugin.api(c);
			assert.strictEqual(api, null);
		});
	});

	it('should apply initial params', () => {
		const doc = TestUtil.createWindow().document;
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
		});
		const api = createBladeApi(forceCast(bc)) as SliderApi;

		assert.strictEqual(api.maxValue, 100);
		assert.strictEqual(api.minValue, -100);
		assert.strictEqual(api.value, 50);

		assert.strictEqual(
			api.controller_.view.element.querySelector('.tp-lblv_l')?.textContent,
			'hello',
		);
	});
});
