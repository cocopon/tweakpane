import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {createApi} from '../plugin';
import {
	createEmptyBladeController,
	createEmptyLabelableController,
	createLabelController,
} from '../test-util';
import {ButtonApi} from './api/button';
import {ButtonBladePlugin} from './plugin';

describe(ButtonBladePlugin.id, () => {
	[
		{},
		{
			view: 'button',
		},
	].forEach((params) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should not create API', () => {
				const doc = TestUtil.createWindow().document;
				const api = createApi(ButtonBladePlugin, {
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
			const api = ButtonBladePlugin.api(c);
			assert.strictEqual(api, null);
		});
	});

	it('should apply initial params', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(ButtonBladePlugin, {
			document: doc,
			params: {
				label: 'initiallabel',
				title: 'Title',
				view: 'button',
			},
		}) as ButtonApi;

		assert.strictEqual(
			api.controller_.view.element.innerHTML.includes('initiallabel'),
			true,
		);
	});
});
