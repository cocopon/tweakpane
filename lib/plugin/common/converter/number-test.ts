import {assert} from 'chai';
import {describe, it} from 'mocha';

import {NumberFormatter, numberFromUnknown, numberToString} from './number';

describe(NumberFormatter.name, () => {
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

	it('should convert number to string', () => {
		assert.strictEqual(numberToString(3.14), '3.14');
	});
});
