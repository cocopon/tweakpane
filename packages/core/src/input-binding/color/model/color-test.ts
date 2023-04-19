import * as assert from 'assert';
import {describe, it} from 'mocha';

import {equalsColor, isRgbaColorObject, isRgbColorObject} from './color.js';
import {FloatColor} from './float-color.js';
import {IntColor} from './int-color.js';

describe(isRgbColorObject.name, () => {
	[
		null,
		undefined,
		{},
		{r: 0},
		{g: 127},
		{b: 255},
		{r: 0, g: 127},
		{g: 0, b: 255},
		{r: 0, b: 255},
		{r: 0, g: 127, b: null},
		{r: 0, g: '127', b: 255},
	].forEach((input: unknown) => {
		describe(`when ${JSON.stringify(input)}`, () => {
			it('should not be regarded as rgb color object', () => {
				assert.strictEqual(isRgbColorObject(input), false);
			});
		});
	});

	[{r: 0, g: 127, b: 255}].forEach((input: unknown) => {
		describe(`when ${JSON.stringify(input)}`, () => {
			it('should be regarded as rgb color object', () => {
				assert.strictEqual(isRgbColorObject(input), true);
			});
		});
	});
});

describe(isRgbaColorObject.name, () => {
	[
		{
			expected: true,
			params: {r: 10, g: 20, b: 30, a: 0.5},
		},
		{
			expected: false,
			params: {r: 10, g: 20, b: 30},
		},
	].forEach(({expected, params}) => {
		describe(`when ${JSON.stringify(params)}`, () => {
			it('should detect RGBA color object', () => {
				assert.strictEqual(isRgbaColorObject(params), expected);
			});
		});
	});
});

describe(equalsColor.name, () => {
	[
		{
			expected: true,
			params: {
				c1: new IntColor([10, 20, 30, 0.5], 'rgb'),
				c2: new IntColor([10, 20, 30, 0.5], 'rgb'),
			},
		},
		{
			expected: false,
			params: {
				c1: new IntColor([10, 20, 30], 'rgb'),
				c2: new IntColor([10, 20, 30, 0.5], 'rgb'),
			},
		},
		{
			expected: false,
			params: {
				c1: new IntColor([10, 20, 30], 'rgb'),
				c2: new IntColor([10, 20, 30], 'hsl'),
			},
		},
		{
			expected: false,
			params: {
				c1: new IntColor([0, 1, 1], 'rgb'),
				c2: new FloatColor([0, 1, 1], 'rgb'),
			},
		},
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should compare color', () => {
				assert.strictEqual(equalsColor(params.c1, params.c2), expected);
			});
		});
	});
});
