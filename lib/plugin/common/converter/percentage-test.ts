import {assert} from 'chai';
import {describe, it} from 'mocha';

import {PercentageFormatter} from './percentage';

describe(PercentageFormatter.name, () => {
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
				const f = new PercentageFormatter();
				assert.strictEqual(f.format(testCase.params.value), testCase.expected);
			});
		});
	});
});
