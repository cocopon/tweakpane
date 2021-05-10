import * as assert from 'assert';
import {describe, it} from 'mocha';

import {formatPercentage} from './percentage';

describe('converter/percentage', () => {
	[
		{
			expected: '0%',
			params: {
				value: 0,
			},
		},
		{
			expected: '12%',
			params: {
				value: 12,
			},
		},
		{
			expected: '100%',
			params: {
				value: 100,
			},
		},
	].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.params)}`, () => {
			it(`it should format to ${JSON.stringify(testCase.expected)}`, () => {
				assert.strictEqual(
					formatPercentage(testCase.params.value),
					testCase.expected,
				);
			});
		});
	});
});
