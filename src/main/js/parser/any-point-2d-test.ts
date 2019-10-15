import {assert} from 'chai';
import {describe, describe as context, it} from 'mocha';

import {Point2dObject} from '../model/point-2d';
import AnyPoint2dParser from './any-point-2d';

interface TestCase {
	expected: Point2dObject;
	input: any;
}

describe(AnyPoint2dParser.name, () => {
	[
		{
			expected: {x: 123, y: 456},
			input: {x: 123, y: 456},
		},
	].forEach((testCase: TestCase) => {
		context(`when ${JSON.stringify(testCase.input)}`, () => {
			it(`should parse as ${JSON.stringify(testCase.expected)}`, () => {
				const actual = AnyPoint2dParser(testCase.input);
				if (!actual) {
					throw new Error('cannot parse');
				}
				assert.deepStrictEqual(actual.toObject(), testCase.expected);
			});
		});
	});

	[{x: 123}, {y: 456}, null, undefined, new Date(), 123, 'text'].forEach(
		(input: unknown) => {
			context(`when ${JSON.stringify(input)}`, () => {
				it('should not parse', () => {
					assert.isNull(AnyPoint2dParser(input));
				});
			});
		},
	);
});
