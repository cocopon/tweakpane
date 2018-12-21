// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import RootController from '../controller/root';
import PaneError from '../misc/pane-error';
import TestUtil from '../misc/test-util';
import RootApi from './root';

function createApi(): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {});
	return new RootApi(c);
}

describe(RootApi.name, () => {
	it('should throw error for unsupported property type', () => {
		const api = createApi();
		const obj = {
			child: {
				foo: 'bar',
			},
		};
		assert.throws(() => {
			api.addMonitor(obj, 'child', {
				interval: 0,
			});
		}, PaneError);
	});
});
