import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {createTestWindow} from '../../misc/dom-test-util.js';
import {createDefaultPluginPool} from '../../plugin/plugins.js';
import {BladeController} from '../common/controller/blade.js';
import {createBladeController} from '../plugin.js';
import {
	createAppropriateBladeController,
	createEmptyBladeController,
} from '../test-util.js';
import {ButtonApi} from './api/button.js';
import {ButtonBladePlugin} from './plugin.js';

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
		(doc: Document) => createAppropriateBladeController(doc),
	].forEach((createController) => {
		it('should not create API', () => {
			const doc = createTestWindow().document;
			const c = createController(doc) as BladeController;
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
		}) as BladeController;
		const pool = createDefaultPluginPool();
		const api = pool.createApi(bc) as ButtonApi;

		assert.strictEqual(
			api.controller.view.element.innerHTML.includes('initiallabel'),
			true,
		);
	});
});
