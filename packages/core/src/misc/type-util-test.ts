import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {deepEqualsArray} from './type-util';

describe('TypeUtil', () => {
	[
		{
			expected: true,
			params: {
				a1: [1, 2, 3],
				a2: [1, 2, 3],
			},
		},
		{
			expected: false,
			params: {
				a1: [1, 2, 3],
				a2: [1, 4, 3],
			},
		},
		{
			expected: false,
			params: {
				a1: [1, 2],
				a2: [1, 2, 3],
			},
		},
		{
			expected: false,
			params: {
				a1: [1, 2, 3],
				a2: [1, 2],
			},
		},
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should compare array deeply', () => {
				assert.strictEqual(deepEqualsArray(params.a1, params.a2), expected);
			});
		});
	});
});
