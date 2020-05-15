import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {CheckboxInputController} from '../controller/input/checkbox';
import {ListInputController} from '../controller/input/list';
import {RootController} from '../controller/root';
import {TestUtil} from '../misc/test-util';
import {Disposable} from '../model/disposable';
import {RootApi} from './root';

function createApi(): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {
		disposable: new Disposable(),
	});
	return new RootApi(c);
}

describe(RootApi.name, () => {
	[
		{
			expectedClass: CheckboxInputController,
			params: {},
			value: false,
		},
		{
			expectedClass: ListInputController,
			params: {
				options: {
					off: false,
					on: true,
				},
			},
			value: true,
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
