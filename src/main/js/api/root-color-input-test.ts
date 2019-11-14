import {assert} from 'chai';
import {describe, describe as context, it} from 'mocha';

import {ColorSwatchTextInputController} from '../controller/input/color-swatch-text';
import {InputController} from '../controller/input/input';
import {RootController} from '../controller/root';
import {TestUtil} from '../misc/test-util';
import {Class} from '../misc/type-util';
import {Color} from '../model/color';
import {RootApi} from './root';
import {InputParams} from './types';

function createApi(): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {});
	return new RootApi(c);
}

interface TestCase {
	expectedClass: Class<InputController<Color>>;
	params: InputParams;
	value: unknown;
}

describe(RootApi.name, () => {
	const testCases: TestCase[] = [
		{
			expectedClass: ColorSwatchTextInputController,
			params: {},
			value: '#00ff00',
		},
		{
			expectedClass: ColorSwatchTextInputController,
			params: {
				input: 'rgb',
			},
			value: 0x112233,
		},
		{
			expectedClass: ColorSwatchTextInputController,
			params: {},
			value: {r: 0, g: 127, b: 255},
		},
	];
	testCases.forEach((testCase) => {
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
