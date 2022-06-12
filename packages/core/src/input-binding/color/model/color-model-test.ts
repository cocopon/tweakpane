import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {convertColor} from './color-model';

const DELTA = 2;

describe('ColorModel', () => {
	const testCases = [
		{
			hsl: {h: 0, s: 0, l: 0},
			hsv: {h: 0, s: 0, v: 0},
			rgb: {r: 0, g: 0, b: 0},
		},
		{
			hsl: {h: 0, s: 0, l: 100},
			hsv: {h: 0, s: 0, v: 100},
			rgb: {r: 255, g: 255, b: 255},
		},
		{
			hsl: {h: 0, s: 100, l: 50},
			hsv: {h: 0, s: 100, v: 100},
			rgb: {r: 255, g: 0, b: 0},
		},
		{
			hsl: {h: 70, s: 32, l: 63},
			hsv: {h: 70, s: 32, v: 75},
			rgb: {r: 180, g: 190, b: 130},
		},
		{
			hsl: {h: 174, s: 71, l: 56},
			hsv: {h: 174, s: 71, v: 88},
			rgb: {r: 64, g: 224, b: 208},
		},
		{
			hsl: {h: 208, s: 100, l: 50},
			hsv: {h: 208, s: 100, v: 100},
			rgb: {r: 0, g: 136, b: 255},
		},
		{
			hsl: {h: 229, s: 20, l: 11},
			hsv: {h: 229, s: 33, v: 13},
			rgb: {r: 22, g: 24, b: 33},
		},
		{
			hsl: {h: 255, s: 32, l: 68},
			hsv: {h: 255, s: 26, v: 78},
			rgb: {r: 160, g: 147, b: 199},
		},
		{
			hsl: {h: 317, s: 38, l: 48},
			hsv: {h: 317, s: 55, v: 67},
			rgb: {r: 170, g: 76, b: 143},
		},
	];
	testCases.forEach(({rgb, hsl, hsv}) => {
		context(`when ${JSON.stringify(rgb)}`, () => {
			it(`it should convert to ${JSON.stringify(hsl)}`, () => {
				const actual = convertColor(
					[rgb.r, rgb.g, rgb.b],
					{mode: 'rgb', type: 'int'},
					{mode: 'hsl', type: 'int'},
				);
				assert.ok(TestUtil.closeTo(actual[0], hsl.h, DELTA), 'h');
				assert.ok(TestUtil.closeTo(actual[1], hsl.s, DELTA), 's');
				assert.ok(TestUtil.closeTo(actual[2], hsl.l, DELTA), 'l');
			});
			it(`it should convert to ${JSON.stringify(hsv)}`, () => {
				const actual = convertColor(
					[rgb.r, rgb.g, rgb.b],
					{mode: 'rgb', type: 'int'},
					{mode: 'hsv', type: 'int'},
				);
				assert.ok(TestUtil.closeTo(actual[0], hsv.h, DELTA), 'h');
				assert.ok(TestUtil.closeTo(actual[1], hsv.s, DELTA), 's');
				assert.ok(TestUtil.closeTo(actual[2], hsv.v, DELTA), 'v');
			});
		});
	});
	testCases.forEach(({rgb, hsl}) => {
		context(`when ${JSON.stringify(hsl)}`, () => {
			it(`it should convert to ${JSON.stringify(rgb)}`, () => {
				const actual = convertColor(
					[hsl.h, hsl.s, hsl.l],
					{mode: 'hsl', type: 'int'},
					{mode: 'rgb', type: 'int'},
				);
				assert.ok(TestUtil.closeTo(actual[0], rgb.r, DELTA), 'r');
				assert.ok(TestUtil.closeTo(actual[1], rgb.g, DELTA), 'g');
				assert.ok(TestUtil.closeTo(actual[2], rgb.b, DELTA), 'b');
			});
		});
	});
	testCases.forEach(({rgb, hsv}) => {
		context(`when ${JSON.stringify(hsv)}`, () => {
			it(`it should convert to ${JSON.stringify(rgb)}`, () => {
				const actual = convertColor(
					[hsv.h, hsv.s, hsv.v],
					{mode: 'hsv', type: 'int'},
					{mode: 'rgb', type: 'int'},
				);
				assert.ok(TestUtil.closeTo(actual[0], rgb.r, DELTA), 'r');
				assert.ok(TestUtil.closeTo(actual[1], rgb.g, DELTA), 'g');
				assert.ok(TestUtil.closeTo(actual[2], rgb.b, DELTA), 'b');
			});
		});
	});
	testCases.forEach(({hsl, hsv}) => {
		context(`when ${JSON.stringify(hsl)}`, () => {
			it(`it should convert to ${JSON.stringify(hsv)}`, () => {
				const actual = convertColor(
					[hsl.h, hsl.s, hsl.l],
					{mode: 'hsl', type: 'int'},
					{mode: 'hsv', type: 'int'},
				);
				assert.ok(TestUtil.closeTo(actual[0], hsv.h, DELTA), 'h');
				assert.ok(TestUtil.closeTo(actual[1], hsv.s, DELTA), 's');
				assert.ok(TestUtil.closeTo(actual[2], hsv.v, DELTA), 'v');
			});
		});
	});
	testCases.forEach(({hsl, hsv}) => {
		context(`when ${JSON.stringify(hsv)}`, () => {
			it(`it should convert to ${JSON.stringify(hsl)}`, () => {
				const actual = convertColor(
					[hsv.h, hsv.s, hsv.v],
					{mode: 'hsv', type: 'int'},
					{mode: 'hsl', type: 'int'},
				);
				assert.ok(TestUtil.closeTo(actual[0], hsl.h, DELTA), 'h');
				assert.ok(TestUtil.closeTo(actual[1], hsl.s, DELTA), 's');
				assert.ok(TestUtil.closeTo(actual[2], hsl.l, DELTA), 'l');
			});
		});
	});

	const t2 = [
		{
			hsl: {h: 4, s: 0, l: 0},
			hsv: {h: 4, s: 0, v: 0},
		},
	];
	t2.forEach(({hsl, hsv}) => {
		context(`when ${JSON.stringify(hsl)}`, () => {
			it(`it should convert to ${JSON.stringify(hsv)}`, () => {
				const actual = convertColor(
					[hsl.h, hsl.s, hsl.l],
					{mode: 'hsl', type: 'int'},
					{mode: 'hsv', type: 'int'},
				);
				assert.ok(TestUtil.closeTo(actual[0], hsv.h, DELTA), 'h');
				assert.ok(TestUtil.closeTo(actual[1], hsv.s, DELTA), 's');
				assert.ok(TestUtil.closeTo(actual[2], hsv.v, DELTA), 'v');
			});
		});
	});
	t2.forEach(({hsl, hsv}) => {
		context(`when ${JSON.stringify(hsv)}`, () => {
			it(`it should convert to ${JSON.stringify(hsl)}`, () => {
				const actual = convertColor(
					[hsv.h, hsv.s, hsv.v],
					{mode: 'hsv', type: 'int'},
					{mode: 'hsl', type: 'int'},
				);
				assert.ok(TestUtil.closeTo(actual[0], hsl.h, DELTA), 'h');
				assert.ok(TestUtil.closeTo(actual[1], hsl.s, DELTA), 's');
				assert.ok(TestUtil.closeTo(actual[2], hsl.l, DELTA), 'l');
			});
		});
	});
});
