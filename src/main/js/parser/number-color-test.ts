import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {NumberColorParser} from './number-color';

describe(NumberColorParser.name, () => {
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
				const actual = NumberColorParser(testCase.input);
				assert.deepStrictEqual(
					actual && actual.toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});
});
