import {assert} from 'chai';
import {describe, describe as context, it} from 'mocha';

import ColorSwatchTextInputController from '../controller/input/color-swatch-text';
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
			expectedClass: ColorSwatchTextInputController,
			params: {},
			value: '#00ff00',
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
