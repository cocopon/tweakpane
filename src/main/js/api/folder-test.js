// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import NumberInputController from '../controller/input/number-text';
import SingleLogController from '../controller/monitor/single-log';
import FolderController from '../controller/folder';
import SeparatorController from '../controller/separator';
import TestUtil from '../misc/test-util';
import FolderApi from './folder';

function createApi(): FolderApi {
	const c = new FolderController(TestUtil.createWindow().document, {
		title: 'Folder',
	});
	return new FolderApi(c);
}

describe(FolderApi.name, () => {
	it('should get expanded', () => {
		const api = createApi();

		api.controller.folder.expanded = false;
		assert.strictEqual(api.expanded, false);
		api.controller.folder.expanded = true;
		assert.strictEqual(api.expanded, true);
	});

	it('should set expanded', () => {
		const api = createApi();

		api.expanded = false;
		assert.strictEqual(api.controller.folder.expanded, false);
		api.expanded = true;
		assert.strictEqual(api.controller.folder.expanded, true);
	});

	it('should add button', () => {
		const api = createApi();
		const b = api.addButton({
			title: 'push',
		});
		assert.strictEqual(b.controller.button.title, 'push');
	});

	it('should add separator', () => {
		const api = createApi();
		api.addSeparator();

		const cs = api.controller.uiControllerList.items;
		assert.instanceOf(cs[cs.length - 1], SeparatorController);
	});

	it('should add input', () => {
		const PARAMS = {
			foo: 1,
		};
		const api = createApi();
		const bapi = api.addInput(PARAMS, 'foo');
		assert.instanceOf(bapi.controller.controller, NumberInputController);
	});

	it('should add monitor', () => {
		const PARAMS = {
			foo: 1,
		};
		const api = createApi();
		const bapi = api.addMonitor(PARAMS, 'foo', {
			interval: 0,
		});
		assert.instanceOf(bapi.controller.controller, SingleLogController);
	});

	it('should listen fold event', (done) => {
		const api = createApi();
		api.on('fold', () => {
			done();
		});
		api.controller.folder.expanded = false;
	});
});
