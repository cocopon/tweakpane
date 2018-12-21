// @flow

import {assert} from 'chai';
import {describe, describe as context, it} from 'mocha';

import ColorParser from './color';

describe(ColorParser.name, () => {
	[
		{
			expected: {r: 0x11, g: 0x22, b: 0x33},
			input: '#112233',
		},
		{
			expected: {r: 0xdd, g: 0xee, b: 0xff},
			input: '#def',
		},
		{
			expected: {r: 0x44, g: 0x55, b: 0x66},
			input: '456',
		},
		{
			expected: {r: 0x99, g: 0xaa, b: 0xbb},
			input: '99aabb',
		},
	].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.input)}`, () => {
			it(`it should parse as ${JSON.stringify(testCase.expected)}`, () => {
				const actual = ColorParser(testCase.input);
				assert.deepStrictEqual(actual && actual.toObject(), testCase.expected);
			});
		});
	});

	it('should not parse invalid string', () => {
		assert.strictEqual(ColorParser('foobar'), null);
		assert.strictEqual(ColorParser('#eeffgg'), null);
	});
});
