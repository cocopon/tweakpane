import {assert} from 'chai';
import {describe, describe as context, it} from 'mocha';

import Color from '../model/color';
import ColorFormatter from './color';

interface TestCase {
	components: [number, number, number];
	hex: string;
	hsl: string;
	rgb: string;
}

describe(ColorFormatter.name, () => {
	const testCases: TestCase[] = [
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
				const c = new Color(...testCase.components);
				const f = new ColorFormatter();
				assert.strictEqual(f.format(c), testCase.hex);
			});
			it(`it should format to ${JSON.stringify(testCase.rgb)}`, () => {
				assert.strictEqual(
					ColorFormatter.rgb(...testCase.components),
					testCase.rgb,
				);
			});
			it(`it should format to ${JSON.stringify(testCase.hsl)}`, () => {
				assert.strictEqual(
					ColorFormatter.hsl(...testCase.components),
					testCase.hsl,
				);
			});
		});
	});
});
