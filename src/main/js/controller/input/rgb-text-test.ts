import {assert} from 'chai';
import {describe, it} from 'mocha';

import NumberFormatter from '../../formatter/number';
import TestUtil from '../../misc/test-util';
import Color, {RgbColorObject} from '../../model/color';
import InputValue from '../../model/input-value';
import StringNumberParser from '../../parser/string-number';
import RgbTextInputController from './rgb-text';

interface ChangeTestCase {
	expected: RgbColorObject;
	params: {
		components: [number, number, number];
		index: number;
		value: string;
	};
}

interface KeydownTestCase {
	expected: RgbColorObject;
	params: {
		components: [number, number, number];
		index: number;
		keys: {
			code: number;
			shift: boolean;
		};
	};
}

describe(RgbTextInputController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new RgbTextInputController(doc, {
			formatter: new NumberFormatter(0),
			parser: StringNumberParser,
			value: new InputValue(new Color([0, 0, 0], 'rgb')),
		});
		c.dispose();
		assert.strictEqual(c.view.disposed, true);
	});

	[
		{
			expected: {r: 123, g: 0, b: 0},
			params: {
				components: [0, 0, 0],
				index: 0,
				value: '123',
			},
		},
		{
			expected: {r: 0, g: 255, b: 0},
			params: {
				components: [0, 0, 0],
				index: 1,
				value: '255',
			},
		},
		{
			expected: {r: 0, g: 0, b: 1},
			params: {
				components: [0, 0, 1],
				index: 2,
				value: '1',
			},
		},
	].forEach((testCase: ChangeTestCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should change component values to ${JSON.stringify(
				testCase.expected,
			)}`, (done) => {
				const value = new InputValue(
					new Color(testCase.params.components, 'rgb'),
				);
				value.emitter.on('change', () => {
					assert.deepStrictEqual(
						value.rawValue.toRgbObject(),
						testCase.expected,
					);
					done();
				});

				const win = TestUtil.createWindow();
				const doc = win.document;
				const c = new RgbTextInputController(doc, {
					formatter: new NumberFormatter(0),
					parser: StringNumberParser,
					value: value,
				});

				const inputElem = c.view.inputElements[testCase.params.index];
				inputElem.value = testCase.params.value;
				inputElem.dispatchEvent(TestUtil.createEvent(win, 'change'));
			});
		});
	});

	[
		{
			expected: {r: 1, g: 0, b: 0},
			params: {
				components: [0, 0, 0],
				index: 0,
				keys: {
					code: 38,
					shift: false,
				},
			},
		},
		{
			expected: {r: 0, g: 99, b: 0},
			params: {
				components: [0, 100, 0],
				index: 1,
				keys: {
					code: 40,
					shift: false,
				},
			},
		},
		{
			expected: {r: 0, g: 0, b: 210},
			params: {
				components: [0, 0, 200],
				index: 2,
				keys: {
					code: 38,
					shift: true,
				},
			},
		},
	].forEach((testCase: KeydownTestCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should change component values to ${JSON.stringify(
				testCase.expected,
			)}`, (done) => {
				const value = new InputValue(
					new Color(testCase.params.components, 'rgb'),
				);
				value.emitter.on('change', () => {
					assert.deepStrictEqual(
						value.rawValue.toRgbObject(),
						testCase.expected,
					);
					done();
				});

				const win = TestUtil.createWindow();
				const doc = win.document;
				const c = new RgbTextInputController(doc, {
					formatter: new NumberFormatter(0),
					parser: StringNumberParser,
					value: value,
				});

				const inputElem = c.view.inputElements[testCase.params.index];
				inputElem.dispatchEvent(
					TestUtil.createKeyboardEvent(win, 'keydown', {
						keyCode: testCase.params.keys.code,
						shiftKey: !!testCase.params.keys.shift,
					}),
				);
			});
		});
	});
});
