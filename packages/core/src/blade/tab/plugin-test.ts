import * as assert from 'assert';
import {describe} from 'mocha';

import {createTestWindow} from '../../misc/dom-test-util';
import {createDefaultPluginPool} from '../../plugin/plugins';
import {createBladeController} from '../plugin';
import {createEmptyBladeController} from '../test-util';
import {TabApi} from './api/tab';
import {TabController} from './controller/tab';
import {TabBladeParams, TabBladePlugin} from './plugin';

describe(TabBladePlugin.id, () => {
	[
		{},
		{
			view: 'tab',
		},
		{
			pages: 'foobar',
			view: 'tab',
		},
		{
			pages: [],
			view: 'tab',
		},
		{
			pages: [{title: null}],
			view: 'tab',
		},
		{
			pages: [{title: 'foo'}, 123],
			view: 'tab',
		},
	].forEach((params) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should not create controller', () => {
				const doc = createTestWindow().document;
				const bc = createBladeController(TabBladePlugin, {
					document: doc,
					params: params,
				});
				assert.strictEqual(bc, null);
			});
		});
	});

	[(doc: Document) => createEmptyBladeController(doc)].forEach(
		(createController) => {
			it('should not create API', () => {
				const doc = createTestWindow().document;
				const c = createController(doc);
				const api = TabBladePlugin.api({
					controller: c,
					pool: createDefaultPluginPool(),
				});
				assert.strictEqual(api, null);
			});
		},
	);

	it('should apply initial params', () => {
		const doc = createTestWindow().document;
		const params = {
			pages: [{title: 'foo'}, {title: 'bar'}],
			view: 'tab',
		} as TabBladeParams;

		const bc = createBladeController(TabBladePlugin, {
			document: doc,
			params: params,
		}) as TabController;
		const api = TabBladePlugin.api({
			controller: bc,
			pool: createDefaultPluginPool(),
		}) as TabApi;
		assert.strictEqual(api.pages[0].title, 'foo');
		assert.strictEqual(api.pages[1].title, 'bar');
	});
});
