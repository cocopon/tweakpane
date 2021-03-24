import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {parseNumber} from '../../../common/converter/number';
import {Value} from '../../../common/model/value';
import {defaultViewProps} from '../../../common/view/view';
import {Color, RgbaColorObject} from '../model/color';
import {PickedColor} from '../model/picked-color';
import {ColorTextController} from './color-text';

interface ChangeTestCase {
	expected: RgbaColorObject;
	params: {
		components: [number, number, number];
		index: number;
		value: string;
	};
}

interface KeydownTestCase {
	expected: RgbaColorObject;
	params: {
		components: [number, number, number];
		index: number;
		keys: {
			code: number;
			shift: boolean;
		};
	};
}

describe(ColorTextController.name, () => {
	([
		{
			expected: {r: 123, g: 0, b: 0, a: 1},
			params: {
				components: [0, 0, 0],
				index: 0,
				value: '123',
			},
		},
		{
			expected: {r: 0, g: 255, b: 0, a: 1},
			params: {
				components: [0, 0, 0],
				index: 1,
				value: '255',
			},
		},
		{
			expected: {r: 12, g: 34, b: 0, a: 1},
			params: {
				components: [12, 34, 56],
				index: 2,
				value: '0',
			},
		},
	] as ChangeTestCase[]).forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should change component values to ${JSON.stringify(
				testCase.expected,
			)}`, (done) => {
				const value = new Value(new Color(testCase.params.components, 'rgb'));
				value.emitter.on('change', () => {
					assert.deepStrictEqual(
						value.rawValue.toRgbaObject(),
						testCase.expected,
					);
					done();
				});

				const win = TestUtil.createWindow();
				const doc = win.document;
				const c = new ColorTextController(doc, {
					parser: parseNumber,
					pickedColor: new PickedColor(value),
					viewProps: defaultViewProps(),
				});

				const inputElem = c.view.textViews[testCase.params.index].inputElement;
				inputElem.value = testCase.params.value;
				inputElem.dispatchEvent(TestUtil.createEvent(win, 'change'));
			});
		});
	});

	([
		{
			expected: {r: 1, g: 0, b: 0, a: 1},
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
			expected: {r: 0, g: 99, b: 0, a: 1},
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
			expected: {r: 0, g: 0, b: 210, a: 1},
			params: {
				components: [0, 0, 200],
				index: 2,
				keys: {
					code: 38,
					shift: true,
				},
			},
		},
	] as KeydownTestCase[]).forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should change component values to ${JSON.stringify(
				testCase.expected,
			)}`, (done) => {
				const value = new Value(new Color(testCase.params.components, 'rgb'));
				value.emitter.on('change', () => {
					assert.deepStrictEqual(
						value.rawValue.toRgbaObject(),
						testCase.expected,
					);
					done();
				});

				const win = TestUtil.createWindow();
				const doc = win.document;
				const c = new ColorTextController(doc, {
					parser: parseNumber,
					pickedColor: new PickedColor(value),
					viewProps: defaultViewProps(),
				});

				const inputElem = c.view.textViews[testCase.params.index].inputElement;
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
