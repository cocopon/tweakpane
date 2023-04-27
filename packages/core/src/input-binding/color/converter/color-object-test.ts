import * as assert from 'assert';
import {describe, it} from 'mocha';

import {Color} from '../model/color.js';
import {colorFromObject} from './color-object.js';

describe(colorFromObject.name, () => {
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
		describe(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert object to color', () => {
				assert.deepStrictEqual(
					colorFromObject(testCase.input, 'int').toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			expected: {r: 10, g: 20, b: 30, a: 1},
			object: {r: 10, g: 20, b: 30},
		},
		{
			expected: {r: 0, g: 255, b: 0, a: 1},
			object: {r: -1, g: 300, b: 0},
		},
		{
			expected: {r: 0, g: 255, b: 0, a: 0.5},
			object: {r: -1, g: 300, b: 0, a: 0.5},
		},
	].forEach(({expected, object}) => {
		describe(`when ${JSON.stringify(object)}`, () => {
			const c = colorFromObject(object, 'int');

			it('should create int color from object', () => {
				assert.deepStrictEqual(c.getComponents('rgb'), [
					expected.r,
					expected.g,
					expected.b,
					expected.a,
				]);
			});
		});
	});

	[
		{
			params: {r: 0, g: 0.5, b: 1},
			expected: [0, 0.5, 1, 1],
		},
		{
			params: {r: 0.1, g: 0.2, b: 0.3, a: 0.5},
			expected: [0.1, 0.2, 0.3, 0.5],
		},
	].forEach(({params, expected}) => {
		describe(`when ${JSON.stringify(params)}`, () => {
			it('should create float color from object', () => {
				const c = colorFromObject(params, 'float');
				assert.deepStrictEqual(c.getComponents(), expected);
			});
		});
	});

	it('should create color for invalid color type', () => {
		let c: Color | null = null;

		assert.doesNotThrow(() => {
			c = colorFromObject({r: 0, g: 0, b: 0}, 'invalid' as any);
		});

		assert.ok(typeof (c as any).mode === 'string');
		assert.ok(typeof (c as any).type === 'string');
	});
});
