// @flow

import {describe as context, describe, it} from 'mocha';
import {assert} from 'chai';

import * as BooleanConverter from './boolean';

describe('booleanConverter', () => {
	[{
		arg: true,
		expected: true,
	}, {
		arg: false,
		expected: false,
	}, {
		arg: 'false',
		expected: false,
	}].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.arg)}`, () => {
			it(`should convert to ${String(testCase.expected)}`, () => {
				assert.strictEqual(
					BooleanConverter.fromMixed(testCase.arg),
					testCase.expected,
				);
			});
		});
	});

	it('should convert boolean to string', () => {
		assert.strictEqual(
			BooleanConverter.toString(true),
			'true',
		);
		assert.strictEqual(
			BooleanConverter.toString(false),
			'false',
		);
	});
});
