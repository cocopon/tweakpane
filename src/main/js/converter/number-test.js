// @flow

import {describe as context, describe, it} from 'mocha';
import {assert} from 'chai';

import * as NumberConverter from './number';

describe('NumberConverter', () => {
	[{
		arg: 3.14,
		expected: 3.14,
	}, {
		arg: '1.4141356',
		expected: 1.4141356,
	}, {
		arg: 'foobar',
		expected: 0,
	}, {
		arg: {foo: 'bar'},
		expected: 0,
	}].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.arg)}`, () => {
			it(`should convert to ${testCase.expected}`, () => {
				assert.strictEqual(
					NumberConverter.fromMixed(testCase.arg),
					testCase.expected,
				);
			});
		});
	});

	it('should convert number to string', () => {
		assert.strictEqual(
			NumberConverter.toString(3.14),
			'3.14',
		);
	});
});
