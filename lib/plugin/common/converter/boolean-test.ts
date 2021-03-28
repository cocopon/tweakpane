import * as assert from 'assert';
import {describe, it} from 'mocha';

import {boolFromUnknown, boolToString} from './boolean';

describe('booleanConverter', () => {
	it('should convert boolean to string', () => {
		assert.strictEqual(boolToString(true), 'true');
		assert.strictEqual(boolToString(false), 'false');
	});

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
