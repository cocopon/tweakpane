import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {ListInputController} from '../controller/input/list';
import {TextInputController} from '../controller/input/text';
import {TestUtil} from '../misc/test-util';
import {TweakpaneWithoutStyle} from '../tweakpane-without-style';

function createPane(): TweakpaneWithoutStyle {
	return new TweakpaneWithoutStyle({
		document: TestUtil.createWindow().document,
	});
}

describe(TweakpaneWithoutStyle.name, () => {
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
		{
			expectedClass: TextInputController,
			params: {
				input: 'string',
			},
			value: '#112233',
		},
		{
			expectedClass: TextInputController,
			params: {
				input: 'string',
			},
			value: 'rgb(0, 100, 200)',
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return class ${testCase.expectedClass.name}`, () => {
				const api = createPane();
				const obj = {foo: testCase.value};
				const bapi = api.addInput(obj, 'foo', testCase.params);
				assert.instanceOf(bapi.controller.controller, testCase.expectedClass);
			});
		});
	});
});
