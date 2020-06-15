import {assert} from 'chai';
import {describe, it} from 'mocha';

import {Color} from '../model/color';
import * as ColorConverter from './color';

describe('ColorConverter', () => {
	// tslint:disable:object-literal-sort-keys
	[
		{
			input: '#112233',
			expected: {
				r: 0x11,
				g: 0x22,
				b: 0x33,
				a: 1,
			},
		},
		{
			input: 'foobar',
			expected: {
				r: 0,
				g: 0,
				b: 0,
				a: 1,
			},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert string to color', () => {
				assert.deepStrictEqual(
					ColorConverter.fromString(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});

	// tslint:disable:object-literal-sort-keys
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
					ColorConverter.fromNumberToRgb(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});

	// tslint:disable:object-literal-sort-keys
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
					ColorConverter.fromNumberToRgba(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});

	// tslint:disable:object-literal-sort-keys
	[
		{
			input: {r: 0x00, g: 0x78, b: 0xff},
			expected: {
				r: 0x00,
				g: 0x78,
				b: 0xff,
				a: 1,
			},
		},
		{
			input: {foo: 'bar'},
			expected: {r: 0, g: 0, b: 0, a: 1},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert object to color', () => {
				assert.deepStrictEqual(
					ColorConverter.fromObject(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			input: new Color([0, 0, 0], 'rgb'),
			expected: '#000000',
		},
		{
			input: new Color([0, 127, 255], 'rgb'),
			expected: '#007fff',
		},
		{
			input: new Color([255, 255, 255], 'rgb'),
			expected: '#ffffff',
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to string', () => {
				assert.strictEqual(
					ColorConverter.toHexRgbString(testCase.input),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			input: new Color([0, 0, 0, 1], 'rgb'),
			expected: 'rgba(0, 0, 0, 1.00)',
		},
		{
			input: new Color([0, 127, 255, 0.5], 'rgb'),
			expected: 'rgba(0, 127, 255, 0.50)',
		},
		{
			input: new Color([255, 255, 255, 0], 'rgb'),
			expected: 'rgba(255, 255, 255, 0.00)',
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to string', () => {
				assert.strictEqual(
					ColorConverter.toFunctionalRgbaString(testCase.input),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			input: new Color([0, 0, 0], 'rgb'),
			expected: 'rgb(0, 0, 0)',
		},
		{
			input: new Color([0, 127, 255], 'rgb'),
			expected: 'rgb(0, 127, 255)',
		},
		{
			input: new Color([255, 255, 255], 'rgb'),
			expected: 'rgb(255, 255, 255)',
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to string', () => {
				assert.strictEqual(
					ColorConverter.toFunctionalRgbString(testCase.input),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			input: new Color([0, 0, 0], 'rgb'),
			expected: 0x000000,
		},
		{
			input: new Color([0, 127, 255], 'rgb'),
			expected: 0x007fff,
		},
		{
			input: new Color([0.1, 127.2, 255.4], 'rgb'),
			expected: 0x007fff,
		},
		{
			input: new Color([255, 255, 255], 'rgb'),
			expected: 0xffffff,
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to number', () => {
				assert.strictEqual(
					ColorConverter.toRgbNumber(testCase.input),
					testCase.expected,
				);
			});
		});
	});
});
