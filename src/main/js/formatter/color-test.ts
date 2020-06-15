import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import * as ColorConverter from '../converter/color';
import {ColorComponents3, ColorComponents4} from '../misc/color-model';
import {Color} from '../model/color';
import {ColorFormatter} from './color';

describe(ColorFormatter.name, () => {
	const testCases: {
		components: ColorComponents3 | ColorComponents4;
		hex: string;
		hsl: string;
		rgb: string;
	}[] = [
		{
			components: [0, 0, 0],
			hex: '#000000',
			hsl: 'hsl(0, 0%, 0%)',
			rgb: 'rgb(0, 0, 0)',
		},
		{
			components: [255, 255, 255],
			hex: '#ffffff',
			hsl: 'hsl(255, 100%, 100%)',
			rgb: 'rgb(255, 255, 255)',
		},
		{
			components: [0, 0, 0, 0.4],
			hex: '#00000066',
			hsl: 'hsla(0, 0%, 0%, 0.4)',
			rgb: 'rgba(0, 0, 0, 0.4)',
		},
		{
			components: [0x22, 0x44, 0x88],
			hex: '#224488',
			hsl: 'hsl(34, 68%, 100%)',
			rgb: 'rgb(34, 68, 136)',
		},
		{
			components: [3.14, 0, 0],
			hex: '#030000',
			hsl: 'hsl(3, 0%, 0%)',
			rgb: 'rgb(3, 0, 0)',
		},
		{
			components: [400, 200, 0],
			hex: '#ffc800',
			hsl: 'hsl(40, 100%, 0%)',
			rgb: 'rgb(255, 200, 0)',
		},
		{
			components: [0, 0, 3776],
			hex: '#0000ff',
			hsl: 'hsl(0, 0%, 100%)',
			rgb: 'rgb(0, 0, 255)',
		},
	];
	testCases.forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.components)}`, () => {
			it(`it should format to ${JSON.stringify(testCase.hex)}`, () => {
				const c = new Color(testCase.components, 'rgb');
				const f =
					testCase.components.length === 3
						? new ColorFormatter(ColorConverter.toHexRgbString)
						: new ColorFormatter(ColorConverter.toHexRgbaString);
				assert.strictEqual(f.format(c), testCase.hex);
			});
			it(`it should format to ${JSON.stringify(testCase.rgb)}`, () => {
				const comps = testCase.components;
				if (comps.length === 3) {
					assert.strictEqual(ColorFormatter.rgb(...comps), testCase.rgb);
				} else if (comps.length === 4) {
					assert.strictEqual(ColorFormatter.rgb(...comps), testCase.rgb);
				} else {
					throw new Error('should not be called');
				}
			});
			it(`it should format to ${JSON.stringify(testCase.hsl)}`, () => {
				const comps = testCase.components;
				if (comps.length === 3) {
					assert.strictEqual(ColorFormatter.hsl(...comps), testCase.hsl);
				} else if (comps.length === 4) {
					assert.strictEqual(ColorFormatter.hsl(...comps), testCase.hsl);
				} else {
					throw new Error('should not be called');
				}
			});
		});
	});
});
