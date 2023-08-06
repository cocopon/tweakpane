import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util.js';
import {Class} from '../../../misc/type-util.js';
import {Color} from './color.js';
import {
	ColorComponents3,
	ColorComponents4,
	ColorMode,
	ColorType,
} from './color-model.js';
import {createColor, mapColorType} from './colors.js';
import {FloatColor} from './float-color.js';
import {IntColor} from './int-color.js';

const DELTA = 1e-5;

describe(createColor.name, () => {
	(
		[
			{
				params: {
					components: [0, 127, 255, 0.5],
					mode: 'rgb',
					type: 'int',
				},
				expected: IntColor,
			},
			{
				params: {
					components: [0, 0.5, 1.0, 0.25],
					mode: 'rgb',
					type: 'float',
				},
				expected: FloatColor,
			},
			{
				params: {
					components: [300, 50, 100, 0.75],
					mode: 'hsl',
					type: 'int',
				},
				expected: IntColor,
			},
		] as {
			params: {
				components: ColorComponents3 | ColorComponents4;
				mode: ColorMode;
				type: ColorType;
			};
			expected: Class<Color>;
		}[]
	).forEach(({params, expected}) => {
		const c = createColor(params.components, params.mode, params.type);
		assert.strictEqual(c.mode, params.mode, 'mode');
		assert.strictEqual(c.type, params.type, 'type');
		c.getComponents(c.mode).forEach((comp, i) => {
			assert.strictEqual(comp, params.components[i], `component[${i}]`);
		});
		assert.ok(c instanceof expected, 'class');
	});
});

describe(mapColorType.name, () => {
	(
		[
			// RGB
			{
				params: {
					input: new IntColor([0, 127, 255, 0.5], 'rgb'),
					toType: 'int',
				},
				expected: {
					components: [0, 127, 255, 0.5],
				},
			},
			{
				params: {
					input: new IntColor([0, 0, 255, 0.5], 'rgb'),
					toType: 'float',
				},
				expected: {
					components: [0, 0, 1, 0.5],
				},
			},
			{
				params: {
					input: new FloatColor([0, 0, 1, 0.25], 'rgb'),
					toType: 'float',
				},
				expected: {
					components: [0, 0, 1, 0.25],
				},
			},
			{
				params: {
					input: new FloatColor([1, 1, 0, 0.75], 'rgb'),
					toType: 'int',
				},
				expected: {
					components: [255, 255, 0, 0.75],
				},
			},
			// HSL
			{
				params: {
					input: new IntColor([180, 50, 100, 0.5], 'hsl'),
					toType: 'int',
				},
				expected: {
					components: [180, 50, 100, 0.5],
				},
			},
			{
				params: {
					input: new IntColor([180, 50, 100, 0.5], 'hsl'),
					toType: 'float',
				},
				expected: {
					components: [0.5, 0.5, 1, 0.5],
				},
			},
			{
				params: {
					input: new FloatColor([0.5, 1, 0.5, 0.25], 'hsl'),
					toType: 'float',
				},
				expected: {
					components: [0.5, 1, 0.5, 0.25],
				},
			},
			{
				params: {
					input: new FloatColor([0.5, 1, 0.5, 0.75], 'hsl'),
					toType: 'int',
				},
				expected: {
					components: [180, 100, 50, 0.75],
				},
			},
		] as {
			params: {
				input: Color;
				toType: ColorType;
			};
			expected: {
				components: ColorComponents4;
			};
		}[]
	).forEach(({params, expected}) => {
		describe(`when ${JSON.stringify(params)}`, () => {
			it('should map color', () => {
				const mc = mapColorType(params.input, params.toType);

				assert.strictEqual(mc.mode, params.input.mode, 'mode');
				mc.getComponents().forEach((comp, i) => {
					assert.ok(
						TestUtil.closeTo(comp, expected.components[i], DELTA),
						`component[${i}]`,
					);
				});
			});
		});
	});
});
