import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {ColorComponents4, ColorMode} from '../misc/color-model';
import * as StringColorParser from './string-color';

const DELTA = 1e-5;

describe('StringColorParser', () => {
	[
		{
			expected: {r: 0x11, g: 0x22, b: 0x33, a: 1},
			inputs: [
				'#112233',
				'#112233ff',
				'rgb(17,34,51)',
				'rgb(17, 34, 51)',
				'rgb( 17  ,  34  ,  51 )',
				'rgba( 17  ,  34  ,  51 , 1 )',
				'rgb(17.0, 34.0, 51.0)',
				'rgba(17.0, 34.0, 51.0, 1)',
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
					const actual = StringColorParser.CompositeParser(input);
					assert.deepStrictEqual(
						actual && actual.toRgbaObject(),
						testCase.expected,
					);
				});
			});
		});
	});

	[
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
	].forEach((text) => {
		it(`should not parse invalid string '${text}'`, () => {
			assert.strictEqual(StringColorParser.CompositeParser(text), null);
		});
	});

	[
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
				const actual = StringColorParser.getNotation(testCase.input);
				assert.deepStrictEqual(actual, testCase.expected);
			});
		});
	});

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
	].forEach(
		({
			expected,
			input,
		}: {
			expected: {
				components: ColorComponents4;
				mode: ColorMode;
			};
			input: string;
		}) => {
			context(`when ${JSON.stringify(input)}`, () => {
				it('should parse color', () => {
					const c = StringColorParser.CompositeParser(input);
					assert.strictEqual(c?.mode, expected.mode);

					const actualComps = c?.getComponents();
					if (!actualComps) {
						throw new Error('should not be called');
					}
					expected.components.forEach((c, index) => {
						assert.closeTo(actualComps[index], c, DELTA);
					});
				});
			});
		},
	);
});
