import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {
	colorFromNumberToRgb,
	colorFromNumberToRgba,
	RgbParser,
} from './number-color';

describe('NumberColorParser', () => {
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
				const actual = RgbParser(testCase.input);
				assert.deepStrictEqual(
					actual && actual.toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});

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
					colorFromNumberToRgb(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});

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
					colorFromNumberToRgba(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});
});
