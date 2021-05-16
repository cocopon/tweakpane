import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {Color, RgbaColorObject} from './color';
import {ColorComponents3, ColorComponents4, ColorMode} from './color-model';

describe(Color.name, () => {
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
			const c = new Color(params.components, 'rgb');
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
			const c = new Color(params.components, params.mode);
			it('should get components', () => {
				assert.deepStrictEqual(c.getComponents(params.mode), expected);
			});
		});
	});

	[{r: 0, g: 127, b: 255}].forEach((input: unknown) => {
		context(`when ${JSON.stringify(input)}`, () => {
			it('should be regarded as rgb color object', () => {
				assert.strictEqual(Color.isRgbColorObject(input), true);
			});
		});
	});

	[
		null,
		undefined,
		{},
		{r: 0},
		{g: 127},
		{b: 255},
		{r: 0, g: 127},
		{g: 0, b: 255},
		{r: 0, b: 255},
		{r: 0, g: 127, b: null},
		{r: 0, g: '127', b: 255},
	].forEach((input: unknown) => {
		context(`when ${JSON.stringify(input)}`, () => {
			it('should not be regarded as rgb color object', () => {
				assert.strictEqual(Color.isRgbColorObject(input), false);
			});
		});
	});

	[
		{
			expected: {r: 10, g: 20, b: 30, a: 1},
			object: {r: 10, g: 20, b: 30},
		},
		{
			expected: {r: 0, g: 255, b: 0, a: 1},
			object: {r: -1, g: 300, b: 0},
		},
		{
			expected: {r: 0, g: 255, b: 0, a: 0.5},
			object: {r: -1, g: 300, b: 0, a: 0.5},
		},
	].forEach(({expected, object}) => {
		context(`when ${JSON.stringify(object)}`, () => {
			const c = Color.fromObject(object);
			it('should create instance from object', () => {
				assert.deepStrictEqual(c.getComponents('rgb'), [
					expected.r,
					expected.g,
					expected.b,
					expected.a,
				]);
			});
		});
	});

	([{mode: 'rgb'}, {mode: 'hsv'}] as {mode: ColorMode}[]).forEach(({mode}) => {
		context(`when ${JSON.stringify({mode})}`, () => {
			it('should get mode', () => {
				const c = new Color([0, 0, 0], mode);
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
				const c = new Color(
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
});
