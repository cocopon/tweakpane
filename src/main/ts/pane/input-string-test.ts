import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {ListController} from '../controller/value/list';
import {TextController} from '../controller/value/text';
import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(Tweakpane.name, () => {
	[
		{
			expectedClass: TextController,
			params: {},
			value: 'foobar',
		},
		{
			expectedClass: ListController,
			params: {
				options: {
					baz: 'qux',
					foo: 'bar',
				},
			},
			value: 'foobar',
		},
		{
			expectedClass: TextController,
			params: {
				input: 'string',
			},
			value: '#112233',
		},
		{
			expectedClass: TextController,
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
