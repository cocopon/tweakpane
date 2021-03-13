import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {RangeConstraint} from '../../common/constraint/range';
import {PointNdConstraint} from '../common/constraint/point-nd';
import {Point2d, Point2dAssembly} from './model/point-2d';
import {getSuitableMaxValue} from './plugin';

describe(getSuitableMaxValue.name, () => {
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
				constraint: new PointNdConstraint({
					assembly: Point2dAssembly,
					components: [new RangeConstraint({min: 0, max: 10})],
				}),
				rawValue: new Point2d(),
			},
		},
		{
			expected: 100,
			params: {
				constraint: new PointNdConstraint({
					assembly: Point2dAssembly,
					components: [undefined, new RangeConstraint({min: -100, max: 0})],
				}),
				rawValue: new Point2d(),
			},
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return ${testCase.expected}`, () => {
				const mv = getSuitableMaxValue(
					testCase.params.rawValue,
					testCase.params.constraint,
				);
				assert.strictEqual(mv, testCase.expected);
			});
		});
	});
});
