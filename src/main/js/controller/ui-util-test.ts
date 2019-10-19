import {assert} from 'chai';
import {describe, describe as context, it} from 'mocha';

import {Constraint} from '../constraint/constraint';
import {Point2dConstraint} from '../constraint/point-2d';
import {RangeConstraint} from '../constraint/range';
import {Point2d} from '../model/point-2d';
import * as UiUtil from './ui-util';

interface TestCase {
	expected: number;
	params: {
		constraint: Constraint<Point2d> | undefined;
		rawValue: Point2d;
	};
}

describe('UiUtil', () => {
	[
		{
			expected: 10,
			params: {
				constraint: undefined,
				rawValue: new Point2d(),
			},
		},
		{
			expected: 340,
			params: {
				constraint: undefined,
				rawValue: new Point2d(12, 34),
			},
		},
		{
			expected: 10,
			params: {
				constraint: new Point2dConstraint({
					x: new RangeConstraint({min: 0, max: 10}),
				}),
				rawValue: new Point2d(),
			},
		},
		{
			expected: 100,
			params: {
				constraint: new Point2dConstraint({
					y: new RangeConstraint({min: -100, max: 0}),
				}),
				rawValue: new Point2d(),
			},
		},
	].forEach((testCase: TestCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return ${testCase.expected}`, () => {
				const mv = UiUtil.getSuitableMaxValueForPoint2dPad(
					testCase.params.constraint,
					testCase.params.rawValue,
				);
				assert.strictEqual(mv, testCase.expected);
			});
		});
	});
});
