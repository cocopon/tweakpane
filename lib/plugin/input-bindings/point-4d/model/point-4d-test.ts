import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {Point4d} from './point-4d';

describe(Point4d.name, () => {
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
			expected: false,
		},
		{
			object: {x: -1, y: 0, z: 1, w: 0},
			expected: true,
		},
		{
			object: {x: 1, y: 2, z: 3, w: '4'},
			expected: false,
		},
	].forEach((testCase) => {
		context(`when object = ${JSON.stringify(testCase.object)}`, () => {
			it(`should regard input as object: ${testCase.expected}`, () => {
				assert.strictEqual(
					Point4d.isObject(testCase.object),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			object: new Point4d(0, 1, 2),
			expected: {x: 0, y: 1, z: 2, w: 0},
		},
		{
			object: new Point4d(),
			expected: {x: 0, y: 0, z: 0, w: 0},
		},
		{
			object: new Point4d(-100),
			expected: {x: -100, y: 0, z: 0, w: 0},
		},
		{
			object: new Point4d(1, 2, 3, 4),
			expected: {x: 1, y: 2, z: 3, w: 4},
		},
	].forEach((testCase) => {
		context(`when Point3d = ${JSON.stringify(testCase.object)}`, () => {
			it(`should convert into object: ${testCase.expected}`, () => {
				assert.deepStrictEqual(testCase.object.toObject(), testCase.expected);
			});
		});
	});
});
