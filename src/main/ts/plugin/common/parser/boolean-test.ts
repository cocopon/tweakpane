import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {boolFromUnknown} from './boolean';

describe('BooleanConverter', () => {
	[
		{
			arg: true,
			expected: true,
		},
		{
			arg: false,
			expected: false,
		},
		{
			arg: 'false',
			expected: false,
		},
	].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.arg)}`, () => {
			it(`should convert to ${String(testCase.expected)}`, () => {
				assert.strictEqual(boolFromUnknown(testCase.arg), testCase.expected);
			});
		});
	});
});
