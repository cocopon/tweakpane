import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util.js';
import {RgbaColorObject} from './color.js';
import {ColorComponents3, ColorComponents4, ColorMode} from './color-model.js';
import {IntColor} from './int-color.js';

const DELTA = 1e-5;

describe(IntColor.name, () => {
	(
		[
			{
				expected: {r: 10, g: 20, b: 30, a: 1},
				params: {
					components: [10, 20, 30],
				},
			},
			{
				expected: {r: 0, g: 255, b: 0, a: 1},
				params: {
					components: [-1, 300, 0],
				},
			},
		] as {
			expected: RgbaColorObject;
			params: {
				components: ColorComponents3;
			};
		}[]
	).forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			const c = new IntColor(params.components, 'rgb');
			it('should get components', () => {
				assert.deepStrictEqual(c.getComponents('rgb'), [
					expected.r,
					expected.g,
					expected.b,
					expected.a,
				]);
			});
			it('should convert to object', () => {
				assert.deepStrictEqual(c.toRgbaObject(), expected);
			});
		});
	});

	(
		[
			{
				expected: [359, 0, 100, 1],
				params: {
					components: [359, 0, 100],
					mode: 'hsv',
				},
			},
			{
				expected: [350, 0, 100, 1],
				params: {
					components: [-10, -10, 100],
					mode: 'hsv',
				},
			},
			{
				expected: [10, 100, 100, 1],
				params: {
					components: [370, 110, 100],
					mode: 'hsv',
				},
			},
			{
				expected: [359, 0, 100, 1],
				params: {
					components: [359, 0, 100],
					mode: 'hsl',
				},
			},
			{
				expected: [350, 0, 100, 1],
				params: {
					components: [-10, -10, 100],
					mode: 'hsl',
				},
			},
			{
				expected: [10, 100, 100, 1],
				params: {
					components: [370, 110, 100],
					mode: 'hsl',
				},
			},
		] as {
			expected: ColorComponents4;
			params: {
				components: ColorComponents3;
				mode: ColorMode;
			};
		}[]
	).forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			const c = new IntColor(params.components, params.mode);
			it('should get components', () => {
				assert.deepStrictEqual(c.getComponents(params.mode), expected);
			});
		});
	});

	([{mode: 'rgb'}, {mode: 'hsv'}] as {mode: ColorMode}[]).forEach(({mode}) => {
		context(`when ${JSON.stringify({mode})}`, () => {
			it('should get mode', () => {
				const c = new IntColor([0, 0, 0], mode);
				assert.strictEqual(c.mode, mode);
			});
		});
	});

	[
		{
			expected: {components: [255, 0, 0, 0.5]},
			params: {
				components: [255, 0, 0, 0.5],
				fromMode: 'rgb',
				toMode: 'rgb',
			},
		},
		{
			expected: {components: [0, 100, 100, 0]},
			params: {
				components: [255, 0, 0, 0],
				fromMode: 'rgb',
				toMode: 'hsv',
			},
		},
		{
			expected: {components: [22, 24, 33, 1]},
			params: {
				components: [229, 33, 13, 1],
				fromMode: 'hsv',
				toMode: 'rgb',
			},
		},
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should get components with specific mode', () => {
				const c = new IntColor(
					params.components as ColorComponents4,
					params.fromMode as ColorMode,
				);
				assert.deepStrictEqual(
					c.getComponents(params.toMode as ColorMode).map((comp, index) => {
						return index === 3 ? comp : Math.floor(comp);
					}),
					expected.components,
				);
			});
		});
	});

	[
		{
			expected: [0, 0, 0, 0],
			params: {
				components: [-10, -20, -30, -1],
				mode: 'rgb',
			},
		},
		{
			expected: [255, 255, 255, 1],
			params: {
				components: [300, 400, 500, 2],
				mode: 'rgb',
			},
		},
		{
			expected: [350, 0, 0, 0],
			params: {
				components: [-10, -20, -30, -1],
				mode: 'hsl',
			},
		},
		{
			expected: [40, 100, 100, 1],
			params: {
				components: [400, 500, 500, 2],
				mode: 'hsl',
			},
		},
		{
			expected: [350, 0, 0, 0],
			params: {
				components: [-10, -20, -30, -1],
				mode: 'hsv',
			},
		},
		{
			expected: [40, 100, 100, 1],
			params: {
				components: [400, 500, 500, 2],
				mode: 'hsv',
			},
		},
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should constrain components', () => {
				const c = new IntColor(
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
					hue: 360,
				},
				expected: 360,
			},
			{
				params: {
					hue: 361,
				},
				expected: 1,
			},
		] as {
			params: {
				hue: number;
			};
			expected: number;
		}[]
	).forEach(({params, expected}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it(`it should constrain hue range`, () => {
				const c1 = new IntColor([params.hue, 0, 0], 'hsl');
				assert.ok(
					TestUtil.closeTo(c1.getComponents('hsl')[0], expected, DELTA),
				);

				const c2 = new IntColor([params.hue, 0, 0], 'hsv');
				assert.ok(
					TestUtil.closeTo(c2.getComponents('hsv')[0], expected, DELTA),
				);
			});
		});
	});
});
