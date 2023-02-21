import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {BindingTarget} from '../../common/binding/target';
import {createTestWindow} from '../../misc/dom-test-util';
import {TestUtil} from '../../misc/test-util';
import {createInputBindingController} from '../plugin';
import {ColorController} from './controller/color';
import {StringColorInputPlugin} from './plugin-string';

describe(StringColorInputPlugin.id, () => {
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
				const doc = createTestWindow().document;
				const c = createInputBindingController(StringColorInputPlugin, {
					document: doc,
					params: {},
					target: new BindingTarget({foo: testCase.params.input}, 'foo'),
				});

				const vc = c?.valueController as ColorController;
				const inputElem = vc.textController.view.inputElement;
				assert.strictEqual(inputElem.value, testCase.expected.inputValue);
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
			const win = createTestWindow();
			const doc = win.document;
			const obj = {foo: params.input};
			const c = createInputBindingController(StringColorInputPlugin, {
				document: doc,
				params: {},
				target: new BindingTarget(obj, 'foo'),
			});

			const vc = c?.valueController as ColorController;
			const inputElem = vc.textController.view.inputElement;

			it(`should have initial input value ${expected.initialInputText}`, () => {
				assert.strictEqual(inputElem.value, expected.initialInputText);
			});

			it(`should have updated value ${expected.updatedValue}`, () => {
				inputElem.value = params.updatedText;
				inputElem.dispatchEvent(TestUtil.createEvent(win, 'change'));
				assert.strictEqual(obj.foo, expected.updatedValue);
			});
		});
	});
});
