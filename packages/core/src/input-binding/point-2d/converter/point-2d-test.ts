import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {BindingTarget} from '../../../common/binding/target';
import {Point2d} from '../model/point-2d';
import {point2dFromUnknown, writePoint2d} from './point-2d';

describe(point2dFromUnknown.name, () => {
	[
		{
			expected: {x: 123, y: 456},
			input: {x: 123, y: 456},
		},
	].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.input)}`, () => {
			it(`should parse as ${JSON.stringify(testCase.expected)}`, () => {
				const actual = point2dFromUnknown(testCase.input);
				if (!actual) {
					assert.fail('cannot parse');
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

describe(writePoint2d.name, () => {
	it('should write value without destruction', () => {
		const obj = {
			foo: {x: 12, y: 34},
		};
		const objFoo = obj.foo;
		const t = new BindingTarget(obj, 'foo');
		writePoint2d(t, new Point2d(56, 78));

		assert.strictEqual(obj.foo, objFoo);
		assert.strictEqual(obj.foo.x, 56);
		assert.strictEqual(obj.foo.y, 78);
	});
});
