import {assert} from 'chai';
import {describe, it} from 'mocha';

import {Color} from '../model/color';
import {ColorComponents3, ColorComponents4} from '../model/color-model';
import {
	ColorFormatter,
	colorFromObject,
	colorFromRgbaNumber,
	colorFromRgbNumber,
	colorToFunctionalHslaString,
	colorToFunctionalHslString,
	colorToFunctionalRgbaString,
	colorToFunctionalRgbString,
	colorToHexRgbaString,
	colorToHexRgbString,
	colorToRgbaNumber,
	colorToRgbNumber,
	numberToRgbColor,
} from './color';

describe(ColorFormatter.name, () => {
	[
		{
			input: {r: 0x00, g: 0x78, b: 0xff},
			expected: {
				r: 0x00,
				g: 0x78,
				b: 0xff,
				a: 1,
			},
		},
		{
			input: {foo: 'bar'},
			expected: {r: 0, g: 0, b: 0, a: 1},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert object to color', () => {
				assert.deepStrictEqual(
					colorFromObject(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});

	it('should format color with specified stringifier', () => {
		const stringifier = (color: Color): string => {
			return String(color);
		};
		const f = new ColorFormatter(stringifier);

		const c = new Color([0, 127, 255], 'rgb');
		assert.strictEqual(f.format(c), stringifier(c));
	});

	[
		{
			input: new Color([0, 0, 0], 'rgb'),
			expected: '#000000',
		},
		{
			input: new Color([0, 127, 255], 'rgb'),
			expected: '#007fff',
		},
		{
			input: new Color([255, 255, 255], 'rgb'),
			expected: '#ffffff',
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to string', () => {
				assert.strictEqual(
					colorToHexRgbString(testCase.input),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			input: new Color([0, 0, 0, 1], 'rgb'),
			frgba: 'rgba(0, 0, 0, 1.00)',
			number: 0x000000ff,
		},
		{
			input: new Color([0, 127, 255, 0.5], 'rgb'),
			frgba: 'rgba(0, 127, 255, 0.50)',
			number: 0x007fff7f,
		},
		{
			input: new Color([255, 255, 255, 0], 'rgb'),
			frgba: 'rgba(255, 255, 255, 0.00)',
			number: 0xffffff00,
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to string', () => {
				assert.strictEqual(
					colorToFunctionalRgbaString(testCase.input),
					testCase.frgba,
				);
			});

			it('should convert color to number', () => {
				assert.strictEqual(colorToRgbaNumber(testCase.input), testCase.number);
			});
		});
	});

	[
		{
			input: new Color([0, 0, 0], 'rgb'),
			expected: 'rgb(0, 0, 0)',
		},
		{
			input: new Color([0, 127, 255], 'rgb'),
			expected: 'rgb(0, 127, 255)',
		},
		{
			input: new Color([255, 255, 255], 'rgb'),
			expected: 'rgb(255, 255, 255)',
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to string', () => {
				assert.strictEqual(
					colorToFunctionalRgbString(testCase.input),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			input: new Color([0, 0, 0], 'hsl'),
			expected: {
				hsl: 'hsl(0, 0%, 0%)',
				hsla: 'hsla(0, 0%, 0%, 1.00)',
			},
		},
		{
			input: new Color([0, 127, 255], 'hsl'),
			expected: {
				hsl: 'hsl(0, 100%, 100%)',
				hsla: 'hsla(0, 100%, 100%, 1.00)',
			},
		},
		{
			input: new Color([255, 11, 22], 'hsl'),
			expected: {
				hsl: 'hsl(255, 11%, 22%)',
				hsla: 'hsla(255, 11%, 22%, 1.00)',
			},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to string (HSL)', () => {
				assert.strictEqual(
					colorToFunctionalHslString(testCase.input),
					testCase.expected.hsl,
				);
				assert.strictEqual(
					colorToFunctionalHslaString(testCase.input),
					testCase.expected.hsla,
				);
			});
		});
	});

	[
		{
			input: new Color([0, 0, 0], 'rgb'),
			expected: 0x000000,
		},
		{
			input: new Color([0, 127, 255], 'rgb'),
			expected: 0x007fff,
		},
		{
			input: new Color([0.1, 127.2, 255.4], 'rgb'),
			expected: 0x007fff,
		},
		{
			input: new Color([255, 255, 255], 'rgb'),
			expected: 0xffffff,
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to number', () => {
				assert.strictEqual(colorToRgbNumber(testCase.input), testCase.expected);
			});
		});
	});

	([
		{
			components: [0, 0, 0],
			hex: '#000000',
			rgb: 'rgb(0, 0, 0)',
		},
		{
			components: [255, 255, 255],
			hex: '#ffffff',
			rgb: 'rgb(255, 255, 255)',
		},
		{
			components: [0, 0, 0, 0.4],
			hex: '#00000066',
			rgb: 'rgba(0, 0, 0, 0.40)',
		},
		{
			components: [0x22, 0x44, 0x88],
			hex: '#224488',
			rgb: 'rgb(34, 68, 136)',
		},
		{
			components: [3.14, 0, 0],
			hex: '#030000',
			rgb: 'rgb(3, 0, 0)',
		},
		{
			components: [400, 200, 0],
			hex: '#ffc800',
			rgb: 'rgb(255, 200, 0)',
		},
		{
			components: [0, 0, 3776],
			hex: '#0000ff',
			rgb: 'rgb(0, 0, 255)',
		},
	] as {
		components: ColorComponents3 | ColorComponents4;
		hex: string;
		rgb: string;
	}[]).forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.components)}`, () => {
			it(`it should format to ${JSON.stringify(testCase.hex)}`, () => {
				const c = new Color(testCase.components, 'rgb');
				const f =
					testCase.components.length === 3
						? new ColorFormatter(colorToHexRgbString)
						: new ColorFormatter(colorToHexRgbaString);
				assert.strictEqual(f.format(c), testCase.hex);
			});

			it(`it should format to ${JSON.stringify(testCase.rgb)}`, () => {
				const comps = testCase.components;
				const c = new Color(comps, 'rgb');

				if (comps.length === 3) {
					assert.strictEqual(colorToFunctionalRgbString(c), testCase.rgb);
				} else if (comps.length === 4) {
					assert.strictEqual(colorToFunctionalRgbaString(c), testCase.rgb);
				} else {
					throw new Error('should not be called');
				}
			});
		});
	});

	[
		{
			expected: {r: 0x11, g: 0x22, b: 0x33, a: 1},
			input: 0x112233,
		},
		{
			expected: {r: 0x00, g: 0xaa, b: 0xff, a: 1},
			input: 0x00aaff,
		},
	].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.input)}`, () => {
			it(`it should parse as ${JSON.stringify(testCase.expected)}`, () => {
				const actual = numberToRgbColor(testCase.input);
				assert.deepStrictEqual(
					actual && actual.toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			input: 0x0078ff,
			expected: {
				r: 0x00,
				g: 0x78,
				b: 0xff,
				a: 1,
			},
		},
		{
			input: 'Not a number',
			expected: {r: 0, g: 0, b: 0, a: 1},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert number to rgb color', () => {
				assert.deepStrictEqual(
					colorFromRgbNumber(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			input: 0x9abcde33,
			expected: {
				r: 0x9a,
				g: 0xbc,
				b: 0xde,
				a: 0.2,
			},
		},
		{
			input: 'Not a number',
			expected: {r: 0, g: 0, b: 0, a: 1},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert number to rgba color', () => {
				assert.deepStrictEqual(
					colorFromRgbaNumber(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});
});
