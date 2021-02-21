import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {numberFromUnknown} from './number';

describe('NumberConverter', () => {
	[
		{
			arg: 3.14,
			expected: 3.14,
		},
		{
			arg: '1.4141356',
			expected: 1.4141356,
		},
		{
			arg: 'foobar',
			expected: 0,
		},
		{
			arg: {foo: 'bar'},
			expected: 0,
		},
	].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.arg)}`, () => {
			it(`should convert to ${testCase.expected}`, () => {
				assert.strictEqual(numberFromUnknown(testCase.arg), testCase.expected);
			});
		});
	});
});
