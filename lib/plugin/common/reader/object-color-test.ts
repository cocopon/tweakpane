import {assert} from 'chai';
import {describe, it} from 'mocha';

import {colorFromObject} from './object-color';

describe('ColorConverter', () => {
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
					colorFromObject(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});
});
