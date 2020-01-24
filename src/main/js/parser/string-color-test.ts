import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import * as StringColorParser from './string-color';

describe('StringColorParser', () => {
	[
		{
			expected: {r: 0x11, g: 0x22, b: 0x33},
			inputs: [
				'#112233',
				'rgb(17,34,51)',
				'rgb(17, 34, 51)',
				'rgb( 17  ,  34  ,  51 )',
				'rgb(17.0, 34.0, 51.0)',
			],
		},
		{
			expected: {r: 0xdd, g: 0xee, b: 0xff},
			inputs: ['#def', 'rgb(221, 238, 100%)'],
		},
		{
			expected: {r: 0x44, g: 0x55, b: 0x66},
			inputs: ['456'],
		},
		{
			expected: {r: 0x99, g: 0xaa, b: 0xbb},
			inputs: ['99aabb'],
		},
	].forEach((testCase) => {
		testCase.inputs.forEach((input) => {
			context(`when ${JSON.stringify(input)}`, () => {
				it(`it should parse as ${JSON.stringify(testCase.expected)}`, () => {
					const actual = StringColorParser.CompositeParser(input);
					assert.deepStrictEqual(
						actual && actual.toRgbObject(),
						testCase.expected,
					);
				});
			});
		});
	});

	['foobar', '#eeffgg', 'rgb(123, 234, ..5)', 'rgb(123, 234, xyz)'].forEach(
		(text) => {
			it(`should not parse invalid string '${text}'`, () => {
				assert.strictEqual(StringColorParser.CompositeParser(text), null);
			});
		},
	);

	[
		{
			expected: 'hex.rgb',
			input: '#009aff',
		},
		{
			expected: 'func.rgb',
			input: 'rgb(17,34,51)',
		},
		{
			expected: null,
			input: 'foobar',
		},
	].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.input)}`, () => {
			it(`it should detect notation as ${JSON.stringify(
				testCase.expected,
			)}`, () => {
				const actual = StringColorParser.getNotation(testCase.input);
				assert.deepStrictEqual(actual, testCase.expected);
			});
		});
	});
});
