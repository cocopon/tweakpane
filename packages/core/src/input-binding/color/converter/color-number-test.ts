import * as assert from 'assert';
import {describe, it} from 'mocha';

import {IntColor} from '../model/int-color.js';
import {
	colorFromRgbaNumber,
	colorFromRgbNumber,
	colorToRgbaNumber,
	colorToRgbNumber,
	numberToRgbColor,
} from './color-number.js';

describe(colorToRgbaNumber.name, () => {
	[
		{
			input: new IntColor([0, 0, 0, 1], 'rgb'),
			frgba: 'rgba(0, 0, 0, 1.00)',
			number: 0x000000ff,
		},
		{
			input: new IntColor([0, 127, 255, 0.5], 'rgb'),
			frgba: 'rgba(0, 127, 255, 0.50)',
			number: 0x007fff7f,
		},
		{
			input: new IntColor([255, 255, 255, 0], 'rgb'),
			frgba: 'rgba(255, 255, 255, 0.00)',
			number: 0xffffff00,
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to number', () => {
				assert.strictEqual(colorToRgbaNumber(testCase.input), testCase.number);
			});
		});
	});
});

describe(colorToRgbNumber.name, () => {
	[
		{
			input: new IntColor([0, 0, 0], 'rgb'),
			expected: 0x000000,
		},
		{
			input: new IntColor([0, 127, 255], 'rgb'),
			expected: 0x007fff,
		},
		{
			input: new IntColor([0.1, 127.2, 255.4], 'rgb'),
			expected: 0x007fff,
		},
		{
			input: new IntColor([255, 255, 255], 'rgb'),
			expected: 0xffffff,
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to number', () => {
				assert.strictEqual(colorToRgbNumber(testCase.input), testCase.expected);
			});
		});
	});
});

describe(numberToRgbColor.name, () => {
	[
		{
			expected: {r: 0x11, g: 0x22, b: 0x33, a: 1},
			input: 0x112233,
		},
		{
			expected: {r: 0x00, g: 0xaa, b: 0xff, a: 1},
			input: 0x00aaff,
		},
	].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.input)}`, () => {
			it(`it should parse as ${JSON.stringify(testCase.expected)}`, () => {
				const actual = numberToRgbColor(testCase.input);
				assert.deepStrictEqual(
					actual && actual.toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});
});

describe(colorFromRgbNumber.name, () => {
	[
		{
			input: 0x0078ff,
			expected: {
				r: 0x00,
				g: 0x78,
				b: 0xff,
				a: 1,
			},
		},
		{
			input: 'Not a number',
			expected: {r: 0, g: 0, b: 0, a: 1},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert number to rgb color', () => {
				assert.deepStrictEqual(
					colorFromRgbNumber(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});
});

describe(colorFromRgbaNumber.name, () => {
	[
		{
			input: 0x9abcde33,
			expected: {
				r: 0x9a,
				g: 0xbc,
				b: 0xde,
				a: 0.2,
			},
		},
		{
			input: 'Not a number',
			expected: {r: 0, g: 0, b: 0, a: 1},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert number to rgba color', () => {
				assert.deepStrictEqual(
					colorFromRgbaNumber(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});
});
