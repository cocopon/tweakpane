import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {ListInputController} from '../controller/input/list';
import {TextInputController} from '../controller/input/text';
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
				const pane = createPane();
				const obj = {foo: testCase.value};
				const bapi = pane.addInput(obj, 'foo', testCase.params);
				assert.instanceOf(bapi.controller.controller, testCase.expectedClass);
			});
		});
	});
});
