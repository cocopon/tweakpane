import * as assert from 'assert';
import {describe, it} from 'mocha';

import {parseNumber} from '../../../common/converter/number';
import {BoundValue} from '../../../common/model/bound-value';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {Color} from '../model/color';
import {ColorComponents3} from '../model/color-model';
import {PickedColor} from '../model/picked-color';
import {ColorTextController} from './color-text';

describe(ColorTextController.name, () => {
	[
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
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should change component values to ${JSON.stringify(
				testCase.expected,
			)}`, (done) => {
				const value = new BoundValue(
					new Color(testCase.params.components as ColorComponents3, 'rgb'),
				);
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
					viewProps: createViewProps(),
				});

				const inputElem = c.view.textViews[testCase.params.index].inputElement;
				inputElem.value = testCase.params.value;
				inputElem.dispatchEvent(TestUtil.createEvent(win, 'change'));
			});
		});
	});

	[
		{
			expected: {r: 1, g: 0, b: 0, a: 1},
			params: {
				components: [0, 0, 0],
				index: 0,
				keys: {
					key: 'ArrowUp',
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
					key: 'ArrowDown',
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
					key: 'ArrowUp',
					shift: true,
				},
			},
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should change component values to ${JSON.stringify(
				testCase.expected,
			)}`, (done) => {
				const value = new BoundValue(
					new Color(testCase.params.components as ColorComponents3, 'rgb'),
				);
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
					viewProps: createViewProps(),
				});

				const inputElem = c.view.textViews[testCase.params.index].inputElement;
				inputElem.dispatchEvent(
					TestUtil.createKeyboardEvent(win, 'keydown', {
						key: testCase.params.keys.key,
						shiftKey: !!testCase.params.keys.shift,
					}),
				);
			});
		});
	});
});
