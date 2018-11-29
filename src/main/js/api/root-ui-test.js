// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import RootController from '../controller/root';
import SeparatorController from '../controller/separator';
import TestUtil from '../misc/test-util';
import RootApi from './root';

function createApi(): RootApi {
	const c = new RootController(
		TestUtil.createWindow().document,
		{},
	);
	return new RootApi(c);
}

describe(RootApi.name, () => {
	it('should add button', () => {
		const api = createApi();
		const b = api.addButton({
			title: 'push',
		});
		assert.strictEqual(
			b.controller.button.title,
			'push',
		);
	});

	it('should add folder', () => {
		const api = createApi();
		const f = api.addFolder({
			title: 'folder',
		});
		assert.strictEqual(
			f.controller.folder.title,
			'folder',
		);
		assert.strictEqual(
			f.controller.folder.expanded,
			true,
		);
	});

	it('should add collapsed folder', () => {
		const api = createApi();
		const f = api.addFolder({
			expanded: false,
			title: 'folder',
		});
		assert.strictEqual(
			f.controller.folder.expanded,
			false,
		);
	});

	it('should add separator', () => {
		const api = createApi();
		api.addSeparator();

		const cs = api.controller.uiControllerList.items;
		assert.instanceOf(
			cs[cs.length - 1],
			SeparatorController,
		);
	});
});
