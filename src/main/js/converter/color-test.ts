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
			},
		},
		{
			input: 'foobar',
			expected: {
				r: 0,
				g: 0,
				b: 0,
			},
		},
		{
			input: 0x0078ff,
			expected: {
				r: 0x00,
				g: 0x78,
				b: 0xff,
			},
		},
		{
			input: {r: 0x00, g: 0x78, b: 0xff},
			expected: {
				r: 0x00,
				g: 0x78,
				b: 0xff,
			},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert mixed to color', () => {
				assert.deepStrictEqual(
					ColorConverter.fromMixed(testCase.input).toRgbObject(),
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
					ColorConverter.toString(testCase.input),
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
					ColorConverter.toNumber(testCase.input),
					testCase.expected,
				);
			});
		});
	});
});
