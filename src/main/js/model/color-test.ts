import {assert} from 'chai';
import {describe, describe as context, it} from 'mocha';

import {Color} from './color';

describe(Color.name, () => {
	[
		{
			expected: {r: 10, g: 20, b: 30},
			rgb: {r: 10, g: 20, b: 30},
		},
		{
			expected: {r: 0, g: 255, b: 0},
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
				]);
			});
			it('should convert to object', () => {
				assert.deepStrictEqual(c.toRgbObject(), expected);
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
				]);
			});
		});
	});
});
