import {assert} from 'chai';
import {describe, it} from 'mocha';

import * as Point2dConverter from './point-2d';

describe('ColorConverter', () => {
	it('should convert mixed to point2d', () => {
		assert.deepStrictEqual(
			Point2dConverter.fromMixed({x: 123, y: 3.1416}).toObject(),
			{
				x: 123,
				y: 3.1416,
			},
		);
		assert.deepStrictEqual(Point2dConverter.fromMixed({x: 123}).toObject(), {
			x: 0,
			y: 0,
		});
		assert.deepStrictEqual(Point2dConverter.fromMixed({y: 42}).toObject(), {
			x: 0,
			y: 0,
		});
		assert.deepStrictEqual(Point2dConverter.fromMixed('foobar').toObject(), {
			x: 0,
			y: 0,
		});
	});
});
