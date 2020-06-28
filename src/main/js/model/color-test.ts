import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {ColorComponents4, ColorMode} from '../misc/color-model';
import {Color} from './color';

describe(Color.name, () => {
	[
		{
			expected: {r: 10, g: 20, b: 30, a: 1},
			rgb: {r: 10, g: 20, b: 30},
		},
		{
			expected: {r: 0, g: 255, b: 0, a: 1},
			rgb: {r: -1, g: 300, b: 0},
		},
	].forEach(({expected, rgb}) => {
		context(`when ${JSON.stringify(rgb)}`, () => {
			const c = new Color([rgb.r, rgb.g, rgb.b], 'rgb');
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

	[
		{
			expected: {h: 359, s: 0, v: 100},
			hsv: {h: 359, s: 0, v: 100},
		},
		{
			expected: {h: 350, s: 0, v: 100},
			hsv: {h: -10, s: -10, v: 100},
		},
		{
			expected: {h: 10, s: 100, v: 100},
			hsv: {h: 370, s: 110, v: 100},
		},
	].forEach(({expected, hsv}) => {
		context(`when ${JSON.stringify(hsv)}`, () => {
			const c = new Color([hsv.h, hsv.s, hsv.v], 'hsv');
			it('should get components', () => {
				assert.deepStrictEqual(c.getComponents('hsv'), [
					expected.h,
					expected.s,
					expected.v,
					1,
				]);
			});
		});
	});

	[{r: 0, g: 127, b: 255}].forEach((input: any) => {
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
	].forEach((input: any) => {
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

	[{mode: 'rgb'}, {mode: 'hsv'}].forEach(({mode}: {mode: ColorMode}) => {
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
				assert.deepEqual(
					c.getComponents(params.toMode as ColorMode).map((comp, index) => {
						return index === 3 ? comp : Math.floor(comp);
					}),
					expected.components,
				);
			});
		});
	});
});
