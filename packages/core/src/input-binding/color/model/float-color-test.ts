import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util.js';
import {ColorComponents4, ColorMode} from './color-model.js';
import {FloatColor} from './float-color.js';

const DELTA = 1e-5;

describe(FloatColor.name, () => {
	[
		{
			expected: [1, 1, 1, 1],
			params: {
				components: [2, 3, 4, 2],
				mode: 'rgb',
			},
		},
		{
			expected: [0.5, 1, 1, 1],
			params: {
				components: [1.5, 3, 4, 2],
				mode: 'hsl',
			},
		},
		{
			expected: [0.5, 1, 1, 1],
			params: {
				components: [1.5, 3, 4, 2],
				mode: 'hsl',
			},
		},
	].forEach(({expected, params}) => {
		describe(`when ${JSON.stringify(params)}`, () => {
			it('should constrain components', () => {
				const c = new FloatColor(
					params.components as ColorComponents4,
					params.mode as ColorMode,
				);
				const o = c.getComponents(params.mode as ColorMode);
				expected.forEach((e, index) => {
					assert.ok(
						TestUtil.closeTo(o[index], e, DELTA),
						`components[${index}]`,
					);
				});
			});
		});
	});

	(
		[
			{
				params: {
					hue: 1,
				},
				expected: 1,
			},
			{
				params: {
					hue: 1.01,
				},
				expected: 0.01,
			},
		] as {
			params: {
				hue: number;
			};
			expected: number;
		}[]
	).forEach(({params, expected}) => {
		describe(`when ${JSON.stringify(params)}`, () => {
			it(`it should constrain hue range`, () => {
				const c1 = new FloatColor([params.hue, 0, 0], 'hsl');
				assert.ok(
					TestUtil.closeTo(c1.getComponents('hsl')[0], expected, DELTA),
				);

				const c2 = new FloatColor([params.hue, 0, 0], 'hsv');
				assert.ok(
					TestUtil.closeTo(c2.getComponents('hsv')[0], expected, DELTA),
				);
			});
		});
	});
});
