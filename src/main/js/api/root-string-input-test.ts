import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {ListInputController} from '../controller/input/list';
import {TextInputController} from '../controller/input/text';
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
			expectedClass: TextInputController,
			params: {},
			value: 'foobar',
		},
		{
			expectedClass: ListInputController,
			params: {
				options: {
					baz: 'qux',
					foo: 'bar',
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
