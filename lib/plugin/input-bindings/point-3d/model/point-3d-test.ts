import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {Point3d} from './point-3d';

describe(Point3d.name, () => {
	[
		{
			object: null,
			expected: false,
		},
		{
			object: undefined,
			expected: false,
		},
		{
			object: {x: 0, y: 1},
			expected: false,
		},
		{
			object: {x: -1, y: 0, z: 1},
			expected: true,
		},
		{
			object: {x: 1, y: 2, z: '3'},
			expected: false,
		},
	].forEach((testCase) => {
		context(`when object = ${JSON.stringify(testCase.object)}`, () => {
			it(`should regard input as object: ${testCase.expected}`, () => {
				assert.strictEqual(
					Point3d.isObject(testCase.object),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			object: new Point3d(0, 1, 2),
			expected: {x: 0, y: 1, z: 2},
		},
		{
			object: new Point3d(),
			expected: {x: 0, y: 0, z: 0},
		},
		{
			object: new Point3d(-100),
			expected: {x: -100, y: 0, z: 0},
		},
	].forEach((testCase) => {
		context(`when Point3d = ${JSON.stringify(testCase.object)}`, () => {
			it(`should convert into object: ${testCase.expected}`, () => {
				assert.deepStrictEqual(testCase.object.toObject(), testCase.expected);
			});
		});
	});
});
