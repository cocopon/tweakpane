import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import Tweakpane from '../index';
import {CheckboxController} from '../input-bindings/boolean/controller';
import {ListController} from '../input-bindings/common/controller/list';
import {TestUtil} from '../misc/test-util';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(Tweakpane.name, () => {
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
				assert.strictEqual(
					bapi.controller_.controller instanceof testCase.expectedClass,
					true,
				);
			});
		});
	});
});
