import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {View} from '../../common/view/view';
import {createTestWindow} from '../../misc/dom-test-util';
import {createDefaultPluginPool} from '../../plugin/plugins';
import {BladeController} from '../common/controller/blade';
import {createBladeController} from '../plugin';
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
				const doc = createTestWindow().document;
				const api = createBladeController(ButtonBladePlugin, {
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
			const api = ButtonBladePlugin.api({
				controller: c,
				pool: createDefaultPluginPool(),
			});
			assert.strictEqual(api, null);
		});
	});

	it('should apply initial params', () => {
		const doc = createTestWindow().document;
		const bc = createBladeController(ButtonBladePlugin, {
			document: doc,
			params: {
				label: 'initiallabel',
				title: 'Title',
				view: 'button',
			},
		}) as BladeController<View>;
		const pool = createDefaultPluginPool();
		const api = pool.createBladeApi(bc) as ButtonApi;

		assert.strictEqual(
			api.controller_.view.element.innerHTML.includes('initiallabel'),
			true,
		);
	});
});
