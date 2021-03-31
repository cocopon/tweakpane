import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import Tweakpane from '..';
import {TestUtil} from '../misc/test-util';
import {Class} from '../misc/type-util';
import {InputParams} from '../plugin/blade/common/api/types';
import {ValueController} from '../plugin/common/controller/value';
import {ColorSwatchTextController} from '../plugin/input-bindings/color/controller/color-swatch-text';
import {Color} from '../plugin/input-bindings/color/model/color';
import {ColorSwatchTextView} from '../plugin/input-bindings/color/view/color-swatch-text';

function createPane(win: Window): Tweakpane {
	return new Tweakpane({
		document: win.document,
	});
}

interface TestCase {
	expectedClass: Class<ValueController<Color>>;
	params: InputParams;
	value: unknown;
}

describe(Tweakpane.name, () => {
	const testCases: TestCase[] = [
		{
			expectedClass: ColorSwatchTextController,
			params: {},
			value: '#00ff00',
		},
		{
			expectedClass: ColorSwatchTextController,
			params: {
				input: 'color',
			},
			value: 0x112233,
		},
		{
			expectedClass: ColorSwatchTextController,
			params: {
				input: 'color.rgb',
			},
			value: 0x112233,
		},
		{
			expectedClass: ColorSwatchTextController,
			params: {
				input: 'color.rgba',
			},
			value: 0x11223344,
		},
		{
			expectedClass: ColorSwatchTextController,
			params: {},
			value: {r: 0, g: 127, b: 255},
		},
		{
			expectedClass: ColorSwatchTextController,
			params: {},
			value: {r: 0, g: 127, b: 255, a: 0.5},
		},
	];
	testCases.forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return class ${testCase.expectedClass.name}`, () => {
				const pane = createPane(TestUtil.createWindow());
				const obj = {foo: testCase.value};
				const bapi = pane.addInput(obj, 'foo', testCase.params);
				assert.strictEqual(
					bapi.controller_.controller instanceof testCase.expectedClass,
					true,
				);
			});
		});
	});

	[
		{
			expected: {
				inputValue: '#112233',
			},
			params: {
				input: '#123',
			},
		},
		{
			expected: {
				inputValue: 'rgb(0, 128, 255)',
			},
			params: {
				input: 'rgb(0,128,255)',
			},
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should have right input value ${testCase.expected.inputValue}`, () => {
				const pane = createPane(TestUtil.createWindow());
				const obj = {foo: testCase.params.input};
				const bapi = pane.addInput(obj, 'foo');

				const view = bapi.controller_.controller.view;
				if (!(view instanceof ColorSwatchTextView)) {
					assert.fail('Unexpected view');
				}

				const inputElem = view.textView.inputElement;
				assert.equal(inputElem.value, testCase.expected.inputValue);
			});
		});
	});

	[
		{
			expected: {
				initialInputText: '#112233',
				updatedValue: '#445566',
			},
			params: {
				input: '#123',
				updatedText: '#456',
			},
		},
		{
			expected: {
				initialInputText: '#445566',
				updatedValue: '#778899',
			},
			params: {
				input: '#445566',
				updatedText: '#778899',
			},
		},
		{
			expected: {
				initialInputText: '#12345678',
				updatedValue: '#001122ff',
			},
			params: {
				input: '#12345678',
				updatedText: '#012',
			},
		},
		{
			expected: {
				initialInputText: 'rgb(255, 255, 0)',
				updatedValue: 'rgb(0, 127, 255)',
			},
			params: {
				input: 'rgb(255,255,0)',
				updatedText: 'rgb(0,127,255)',
			},
		},
		{
			expected: {
				initialInputText: 'rgba(12, 34, 56, 0.70)',
				updatedValue: 'rgba(89, 10, 12, 0.34)',
			},
			params: {
				input: 'rgba(12,34,56,0.7)',
				updatedText: 'rgba(89,10,12,0.34)',
			},
		},
	].forEach(({expected, params}) => {
		context(`when params = ${JSON.stringify(params)}`, () => {
			const win = TestUtil.createWindow();
			const pane = createPane(win);
			const obj = {foo: params.input};
			const bapi = pane.addInput(obj, 'foo');

			const view = bapi.controller_.controller.view;
			if (!(view instanceof ColorSwatchTextView)) {
				assert.fail('Unexpected view');
			}
			const inputElem = view.textView.inputElement;

			it(`should have initial input value ${expected.initialInputText}`, () => {
				assert.equal(inputElem.value, expected.initialInputText);
			});

			it(`should have updated value ${expected.updatedValue}`, () => {
				inputElem.value = params.updatedText;
				inputElem.dispatchEvent(TestUtil.createEvent(win, 'change'));
				assert.strictEqual(obj.foo, expected.updatedValue);
			});
		});
	});
});
