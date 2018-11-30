// @flow

import {describe as context, describe, it} from 'mocha';
import {assert} from 'chai';

import ListInputController from '../controller/input/list';
import TextInputController from '../controller/input/text';
import RootController from '../controller/root';
import TestUtil from '../misc/test-util';
import RootApi from './root';

function createApi(): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {});
	return new RootApi(c);
}

describe(RootApi.name, () => {
	[
		{
			expectedClass: TextInputController,
			params: {},
			value: 'foobar',
		},
		{
			expectedClass: ListInputController,
			params: {
				options: {
					foo: 'bar',
					baz: 'qux',
				},
			},
			value: 'foobar',
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return class ${testCase.expectedClass.name}`, () => {
				const api = createApi();
				const obj = {foo: testCase.value};
				const bapi = api.addInput(obj, 'foo', testCase.params);
				assert.instanceOf(bapi.controller.controller, testCase.expectedClass);
			});
		});
	});
});
