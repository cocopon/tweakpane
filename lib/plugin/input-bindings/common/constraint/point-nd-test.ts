import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {Constraint} from '../../../common/constraint/constraint';
import {RangeConstraint} from '../../../common/constraint/range';
import {
	Point2d,
	Point2dAssembly,
	Point2dObject,
} from '../../point-2d/model/point-2d';
import {PointNdConstraint} from './point-nd';

interface TestCase {
	expected: Point2dObject;
	params: {
		config: {
			x?: Constraint<number>;
			y?: Constraint<number>;
		};
		value: Point2dObject;
	};
}

describe(PointNdConstraint.name, () => {
	[
		{
			expected: {x: 123, y: -123},
			params: {
				config: {},
				value: {x: 123, y: -123},
			},
		},
		{
			expected: {x: 0, y: -50},
			params: {
				config: {
					x: new RangeConstraint({min: 0}),
					y: new RangeConstraint({min: -50}),
				},
				value: {x: -100, y: -100},
			},
		},
	].forEach((testCase: TestCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should constrain value to ${JSON.stringify(
				testCase.expected,
			)}`, () => {
				const c = new PointNdConstraint({
					assembly: Point2dAssembly,
					components: [testCase.params.config.x, testCase.params.config.y],
				});
				const v = c.constrain(
					new Point2d(testCase.params.value.x, testCase.params.value.y),
				);
				assert.deepStrictEqual(v.toObject(), testCase.expected);
			});
		});
	});
});
