// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import * as ColorConverter from './color';

describe('ColorConverter', () => {
	it('should convert mixed to color', () => {
		assert.deepEqual(
			ColorConverter.fromMixed('#112233'),
			{r: 0x11, g: 0x22, b: 0x33},
		);
		assert.deepEqual(
			ColorConverter.fromMixed('foobar'),
			{r: 0, g: 0, b: 0},
		);
		assert.deepEqual(
			ColorConverter.fromMixed(123),
			{r: 0, g: 0, b: 0},
		);
	});

	it('should convert color to string', () => {
		assert.strictEqual(
			ColorConverter.toString({r: 0, g: 0, b: 0}),
			'#000000',
		);
		assert.strictEqual(
			ColorConverter.toString({r: 0, g: 127, b: 255}),
			'#007fff',
		);
		assert.strictEqual(
			ColorConverter.toString({r: 255, g: 255, b: 255}),
			'#ffffff',
		);
	});
});
