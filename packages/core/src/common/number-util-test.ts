import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {
	constrainRange,
	getDecimalDigits,
	loopRange,
	mapRange,
} from './number-util';

const DELTA = 1e-5;

interface ConstrainTestCase {
	args: [number, number, number];
	expected: number;
}

interface MapTestCase {
	args: [number, number, number, number, number];
	expected: number;
}

interface LoopTestCase {
	args: [number, number];
	expected: number;
}

describe('NumberUtil', () => {
	(
		[
			{
				args: [100, 0, 200, 0, 1],
				expected: 0.5,
			},
			{
				args: [32, 0, 16, 0, 1],
				expected: 2,
			},
			{
				args: [0.5, 0, 1, 20, 40],
				expected: 30,
			},
			{
				args: [1.5, 0, 1, -30, 30],
				expected: 60,
			},
		] as MapTestCase[]
	).forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.args)}`, () => {
			it(`should map to ${testCase.expected}`, () => {
				assert.ok(
					TestUtil.closeTo(
						mapRange(...testCase.args),
						testCase.expected,
						DELTA,
					),
				);
			});
		});
	});

	[
		{
			arg: -273,
			expected: 0,
		},
		{
			arg: 0,
			expected: 0,
		},
		{
			arg: 1.00012,
			expected: 5,
		},
		{
			arg: 1.4141356,
			expected: 7,
		},
		{
			arg: 3.14,
			expected: 2,
		},
		{
			arg: 3776,
			expected: 0,
		},
	].forEach((testCase) => {
		context(`when ${testCase.arg}`, () => {
			it(`should return digits = ${testCase.expected}`, () => {
				assert.strictEqual(getDecimalDigits(testCase.arg), testCase.expected);
			});
		});
	});

	(
		[
			{
				args: [0, 0, 0],
				expected: 0,
			},
			{
				args: [-123, 10, 100],
				expected: 10,
			},
			{
				args: [123, 10, 100],
				expected: 100,
			},
		] as ConstrainTestCase[]
	).forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.args)}`, () => {
			it(`should constrain ${testCase.expected}`, () => {
				assert.strictEqual(constrainRange(...testCase.args), testCase.expected);
			});
		});
	});

	(
		[
			{
				args: [260 - 360 * 3, 360],
				expected: 260,
			},
			{
				args: [0, 360],
				expected: 0,
			},
			{
				args: [360, 360],
				expected: 0,
			},
			{
				args: [360 + 40, 360],
				expected: 40,
			},
			{
				args: [360 * 2 + 123, 360],
				expected: 123,
			},
		] as LoopTestCase[]
	).forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.args)}`, () => {
			it(`should loop ${testCase.expected}`, () => {
				assert.strictEqual(loopRange(...testCase.args), testCase.expected);
			});
		});
	});
});
