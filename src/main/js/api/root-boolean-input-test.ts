import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {CheckboxInputController} from '../controller/input/checkbox';
import {ListInputController} from '../controller/input/list';
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
				const api = createPane();
				const obj = {foo: testCase.value};
				const bapi = api.addInput(obj, 'foo', testCase.params);
				assert.instanceOf(bapi.controller.controller, testCase.expectedClass);
			});
		});
	});
});
