import {assert} from 'chai';
import {describe, it} from 'mocha';

import {NumberFormatter} from './number';

describe(NumberFormatter.name, () => {
	it('should get digits', () => {
		const f = new NumberFormatter(3);
		assert.strictEqual(f.digits, 3);
	});

	[
		{
			expected: '0.00',
			params: {
				digits: 2,
				value: 0,
			},
		},
		{
			expected: '3',
			params: {
				digits: 0,
				value: 3.14,
			},
		},
		{
			expected: '141.41',
			params: {
				digits: 2,
				value: 141.41356,
			},
		},
	].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.params)}`, () => {
			it(`it should format to ${JSON.stringify(testCase.expected)}`, () => {
				const f = new NumberFormatter(testCase.params.digits);
				assert.strictEqual(f.format(testCase.params.value), testCase.expected);
			});
		});
	});

	[-10, 0, 20, 100, 1000].forEach((digits) => {
		context(`when ${digits}`, () => {
			it(`it should format without error`, () => {
				const f = new NumberFormatter(digits);
				assert.doesNotThrow(() => {
					f.format(Math.PI);
				});
			});
		});
	});
});
