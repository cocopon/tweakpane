// @flow

import {describe as context, describe, it} from 'mocha';
import {assert} from 'chai';

import NumberUtil from './number-util';

const DELTA = 1e-5;

describe('NumberUtil', () => {
	[{
		args: [100, 0, 200, 0, 1],
		expected: 0.5,
	}, {
		args: [32, 0, 16, 0, 1],
		expected: 2,
	}, {
		args: [0.5, 0, 1, 20, 40],
		expected: 30,
	}, {
		args: [1.5, 0, 1, -30, 30],
		expected: 60,
	}].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.args)}`, () => {
			it(`should map to ${testCase.expected}`, () => {
				assert.closeTo(
					NumberUtil.map(...testCase.args),
					testCase.expected,
					DELTA,
				);
			});
		});
	});

	[{
		arg: -273,
		expected: 0,
	}, {
		arg: 0,
		expected: 0,
	}, {
		arg: 1.00012,
		expected: 5,
	}, {
		arg: 1.4141356,
		expected: 7,
	}, {
		arg: 3.14,
		expected: 2,
	}, {
		arg: 3776,
		expected: 0,
	}].forEach((testCase) => {
		context(`when ${testCase.arg}`, () => {
			it(`should return digits = ${testCase.expected}`, () => {
				assert.strictEqual(
					NumberUtil.getDecimalDigits(testCase.arg),
					testCase.expected,
				);
			});
		});
	});
});
