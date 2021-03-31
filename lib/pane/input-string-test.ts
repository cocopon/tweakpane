import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import Tweakpane from '../index';
import {ListController} from '../input-bindings/common/controller/list';
import {TextController} from '../input-bindings/common/controller/text';
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
				assert.strictEqual(
					bapi.controller_.controller instanceof testCase.expectedClass,
					true,
				);
			});
		});
	});
});
