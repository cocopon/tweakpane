import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {Point2dObject} from '../model/point-2d';
import {point2dFromUnknown} from './point-2d';

interface TestCase {
	expected: Point2dObject;
	input: any;
}

describe('Point2dParser', () => {
	[
		{
			expected: {x: 123, y: 456},
			input: {x: 123, y: 456},
		},
	].forEach((testCase: TestCase) => {
		context(`when ${JSON.stringify(testCase.input)}`, () => {
			it(`should parse as ${JSON.stringify(testCase.expected)}`, () => {
				const actual = point2dFromUnknown(testCase.input);
				if (!actual) {
					throw new Error('cannot parse');
				}
				assert.deepStrictEqual(actual.toObject(), testCase.expected);
			});
		});
	});

	it('should convert mixed to point2d', () => {
		assert.deepStrictEqual(point2dFromUnknown({x: 123, y: 3.1416}).toObject(), {
			x: 123,
			y: 3.1416,
		});
		assert.deepStrictEqual(point2dFromUnknown({x: 123}).toObject(), {
			x: 0,
			y: 0,
		});
		assert.deepStrictEqual(point2dFromUnknown({y: 42}).toObject(), {
			x: 0,
			y: 0,
		});
		assert.deepStrictEqual(point2dFromUnknown('foobar').toObject(), {
			x: 0,
			y: 0,
		});
	});
});
