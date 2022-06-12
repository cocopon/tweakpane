import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {Color} from '../model/color';
import {
	ColorComponents3,
	ColorComponents4,
	ColorMode,
} from '../model/color-model';
import {
	colorToFunctionalHslaString,
	colorToFunctionalHslString,
	colorToFunctionalRgbaString,
	colorToFunctionalRgbString,
	colorToHexRgbaString,
	colorToHexRgbString,
	colorToObjectRgbString,
	createColorStringBindingReader,
	createColorStringParser,
	getColorNotation,
} from './color-string';

const DELTA = 1e-5;

describe(createColorStringParser.name, () => {
	[
		{
			expected: {r: 0x11, g: 0x22, b: 0x33, a: 1},
			inputs: [
				'0x112233',
				'0x112233ff',
				'#112233',
				'#112233ff',
				'rgb(17,34,51)',
				'rgb(17, 34, 51)',
				'rgb( 17  ,  34  ,  51 )',
				'rgba( 17  ,  34  ,  51 , 1 )',
				'rgb(17.0, 34.0, 51.0)',
				'rgba(17.0, 34.0, 51.0, 1)',
				'{r: 17, g: 34, b: 51}',
				'{ r : 17, g : 34, b : 51 }',
				'{r: 17, g: 34, b: 51, a: 1.0}',
				'{ r : 17, g : 34, b : 51 , a : 1.0 }',
			],
		},
		{
			expected: {r: 0xdd, g: 0xee, b: 0xff, a: 1},
			inputs: ['#def', '#deff', 'rgb(221, 238, 100%)'],
		},
	].forEach((testCase) => {
		testCase.inputs.forEach((input) => {
			context(`when ${JSON.stringify(input)}`, () => {
				it(`it should parse as ${JSON.stringify(testCase.expected)}`, () => {
					const actual = createColorStringParser('int')(input);
					assert.deepStrictEqual(
						actual && actual.toRgbaObject(),
						testCase.expected,
					);
				});
			});
		});
	});

	[
		'0x123',
		'601',
		'112233',
		'foobar',
		'#eeffgg',
		'hsl(55, ..66, 78)',
		'hsl(55, 66, ..78)',
		'hsla(55, 66, 78, ..9)',
		'rgb(123, 234, ..5)',
		'rgb(123, 234, xyz)',
		'rgba(55, 66, 78, ..9)',
		'rgba(55, 66, 78, foo)',
		'{r: 11, g: 22, b: 33, a: bar}',
	].forEach((text) => {
		it(`should not parse invalid string '${text}'`, () => {
			assert.strictEqual(createColorStringParser('int')(text), null);
		});
	});

	[
		{
			expected: 'hex.rgb',
			input: '0x009aff',
		},
		{
			expected: 'hex.rgb',
			input: '#009aff',
		},
		{
			expected: 'func.rgb',
			input: 'rgb(17,34,51)',
		},
		{
			expected: null,
			input: 'foobar',
		},
	].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.input)}`, () => {
			it(`it should detect notation as ${JSON.stringify(
				testCase.expected,
			)}`, () => {
				const actual = getColorNotation(testCase.input);
				assert.deepStrictEqual(actual, testCase.expected);
			});
		});
	});

	(
		[
			{
				expected: {
					components: [123, 45, 67, 1.0],
					mode: 'hsl',
				},
				input: 'hsl(123, 45, 67)',
			},
			{
				expected: {
					components: [123, 0, 0, 1.0],
					mode: 'hsl',
				},
				input: 'hsla(123, 0, 0, 1)',
			},
			{
				expected: {
					components: [180, 0, 0, 1.0],
					mode: 'hsl',
				},
				input: 'hsla(180deg, 0, 0, 1)',
			},
			{
				expected: {
					components: [(3 * 360) / (2 * Math.PI), 0, 0, 1.0],
					mode: 'hsl',
				},
				input: 'hsla(3rad, 0, 0, 1)',
			},
			{
				expected: {
					components: [180, 0, 0, 1.0],
					mode: 'hsl',
				},
				input: 'hsla(200grad, 0, 0, 1)',
			},
			{
				expected: {
					components: [90, 0, 0, 1.0],
					mode: 'hsl',
				},
				input: 'hsla(0.25turn, 0, 0, 1)',
			},
			{
				expected: {
					components: [0, 0, 0, 0.5],
					mode: 'hsl',
				},
				input: 'hsla(0, 0%, 0%, 0.5)',
			},
		] as {
			expected: {
				components: ColorComponents4;
				mode: ColorMode;
			};
			input: string;
		}[]
	).forEach(({expected, input}) => {
		context(`when ${JSON.stringify(input)}`, () => {
			it('should parse color', () => {
				const c = createColorStringParser('int')(input);
				assert.strictEqual(c?.mode, expected.mode);

				const actualComps = c?.getComponents();
				if (!actualComps) {
					assert.fail('should not be called');
				}
				expected.components.forEach((c, index) => {
					assert.ok(TestUtil.closeTo(actualComps[index], c, DELTA));
				});
			});
		});
	});

	[
		{
			input: '#112233',
			expected: {
				r: 0x11,
				g: 0x22,
				b: 0x33,
				a: 1,
			},
		},
		{
			input: 'foobar',
			expected: {
				r: 0,
				g: 0,
				b: 0,
				a: 1,
			},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert string to color', () => {
				assert.deepStrictEqual(
					createColorStringBindingReader('int')(testCase.input).toRgbaObject(),
					testCase.expected,
				);
			});
		});
	});

	it('should format color with specified stringifier', () => {
		const stringifier = (color: Color): string => {
			return String(color);
		};
		const c = new Color([0, 127, 255], 'rgb');
		assert.strictEqual(stringifier(c), stringifier(c));
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
			it('should convert color to int RGBA string', () => {
				assert.strictEqual(
					colorToFunctionalRgbaString(testCase.input),
					testCase.frgba,
				);
			});
		});
	});

	[
		{
			input: new Color([0, 0, 0], 'rgb'),
			expected: {
				int: 'rgb(0, 0, 0)',
				float: 'rgb(0.00, 0.00, 0.00)',
			},
		},
		{
			input: new Color([0, 127, 255], 'rgb'),
			expected: {
				int: 'rgb(0, 127, 255)',
				float: 'rgb(0.00, 0.50, 1.00)',
			},
		},
		{
			input: new Color([255, 255, 255], 'rgb'),
			expected: {
				int: 'rgb(255, 255, 255)',
				float: 'rgb(1.00, 1.00, 1.00)',
			},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to RGB string', () => {
				assert.strictEqual(
					colorToFunctionalRgbString(testCase.input),
					testCase.expected.int,
				);
				assert.strictEqual(
					colorToFunctionalRgbString(testCase.input, 'float'),
					testCase.expected.float,
				);
			});
		});
	});

	[
		{
			input: new Color([0, 0, 0, 1], 'rgb', 'int'),
			expected: 'rgba(0.00, 0.00, 0.00, 1.00)',
		},
		{
			input: new Color([0, 127, 255, 1], 'rgb', 'int'),
			expected: 'rgba(0.00, 0.50, 1.00, 1.00)',
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to float RGBA string', () => {
				assert.strictEqual(
					colorToFunctionalRgbaString(testCase.input, 'float'),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			input: new Color([0, 0, 0], 'rgb', 'int'),
			expected: {
				int: '{r: 0, g: 0, b: 0}',
				float: '{r: 0.00, g: 0.00, b: 0.00}',
			},
		},
		{
			input: new Color([0, 127, 255], 'rgb', 'int'),
			expected: {
				int: '{r: 0, g: 127, b: 255}',
				float: '{r: 0.00, g: 0.50, b: 1.00}',
			},
		},
	].forEach((testCase) => {
		context(`when input = ${JSON.stringify(testCase.input)}`, () => {
			it('should convert color to RGB object', () => {
				assert.strictEqual(
					colorToObjectRgbString(testCase.input, 'int'),
					testCase.expected.int,
				);
				assert.strictEqual(
					colorToObjectRgbString(testCase.input, 'float'),
					testCase.expected.float,
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
			it('should convert color to HSL string', () => {
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

	(
		[
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
		}[]
	).forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.components)}`, () => {
			it(`it should format to ${JSON.stringify(testCase.hex)}`, () => {
				const c = new Color(testCase.components, 'rgb');
				const f =
					testCase.components.length === 3
						? colorToHexRgbString
						: colorToHexRgbaString;
				assert.strictEqual(f(c), testCase.hex);
			});

			it(`it should format to ${JSON.stringify(testCase.rgb)}`, () => {
				const comps = testCase.components;
				const c = new Color(comps, 'rgb');

				if (comps.length === 3) {
					assert.strictEqual(colorToFunctionalRgbString(c), testCase.rgb);
				} else if (comps.length === 4) {
					assert.strictEqual(colorToFunctionalRgbaString(c), testCase.rgb);
				} else {
					assert.fail('should not be called');
				}
			});
		});
	});

	it('should format color with prefix', () => {
		const c = new Color([0x12, 0x34, 0x56, 1], 'rgb');
		assert.strictEqual(colorToHexRgbString(c, '0x'), '0x123456');
		assert.strictEqual(colorToHexRgbaString(c, '0x'), '0x123456ff');
	});
});
