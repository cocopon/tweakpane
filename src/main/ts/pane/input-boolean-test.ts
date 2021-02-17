import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {CheckboxController} from '../controller/value/checkbox';
import {ListController} from '../controller/value/list';
import {TestUtil} from '../misc/test-util';
import {PlainTweakpane} from './plain-tweakpane';

function createPane(): PlainTweakpane {
	return new PlainTweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(PlainTweakpane.name, () => {
	[
		{
			expectedClass: CheckboxController,
			params: {},
			value: false,
		},
		{
			expectedClass: ListController,
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
				const pane = createPane();
				const obj = {foo: testCase.value};
				const bapi = pane.addInput(obj, 'foo', testCase.params);
				assert.instanceOf(bapi.controller.controller, testCase.expectedClass);
			});
		});
	});
});
