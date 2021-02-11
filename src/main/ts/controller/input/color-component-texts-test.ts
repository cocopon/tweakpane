import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {Color, RgbaColorObject} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {PickedColor} from '../../model/picked-color';
import {ViewModel} from '../../model/view-model';
import {StringNumberParser} from '../../parser/string-number';
import {ColorComponentTextsInputController} from './color-component-texts';

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

describe(ColorComponentTextsInputController.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new ColorComponentTextsInputController(doc, {
			parser: StringNumberParser,
			pickedColor: new PickedColor(new InputValue(new Color([0, 0, 0], 'rgb'))),
			viewModel: new ViewModel(),
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});

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
			expected: {r: 0, g: 0, b: 1, a: 1},
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
						value.rawValue.toRgbaObject(),
						testCase.expected,
					);
					done();
				});

				const win = TestUtil.createWindow();
				const doc = win.document;
				const c = new ColorComponentTextsInputController(doc, {
					parser: StringNumberParser,
					pickedColor: new PickedColor(value),
					viewModel: new ViewModel(),
				});

				const inputElem = c.view.inputElements[testCase.params.index];
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
						value.rawValue.toRgbaObject(),
						testCase.expected,
					);
					done();
				});

				const win = TestUtil.createWindow();
				const doc = win.document;
				const c = new ColorComponentTextsInputController(doc, {
					parser: StringNumberParser,
					pickedColor: new PickedColor(value),
					viewModel: new ViewModel(),
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
