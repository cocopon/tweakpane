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
import {TextBladeApi} from './api/text';
import {TextBladeParams, TextBladePlugin} from './plugin';

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
				const doc = TestUtil.createWindow().document;
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
		(doc: Document) =>
			createLabelController(doc, createEmptyLabelableController(doc)),
	].forEach((createController) => {
		it('should not create API', () => {
			const doc = TestUtil.createWindow().document;
			const c = createController(doc);
			const api = TextBladePlugin.api(c);
			assert.strictEqual(api, null);
		});
	});

	it('should apply initial params', () => {
		const doc = TestUtil.createWindow().document;
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
		});
		const api = createBladeApi(forceCast(bc)) as TextBladeApi<string>;
		assert.strictEqual(api.formatter, formatter);
		assert.strictEqual(api.value, 'hello');
		assert.strictEqual(
			api.controller_.view.element.querySelector('.tp-lblv_l')?.textContent,
			'hello',
		);
	});
});
