// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import ColorParser from './color';

describe(ColorParser.name, () => {
	it('should parse color', () => {
		assert.deepStrictEqual(ColorParser('#112233'), {r: 0x11, g: 0x22, b: 0x33});
		assert.deepStrictEqual(ColorParser('#def'), {r: 0xdd, g: 0xee, b: 0xff});
		assert.deepStrictEqual(ColorParser('456'), {r: 0x44, g: 0x55, b: 0x66});
		assert.deepStrictEqual(ColorParser('99aabb'), {r: 0x99, g: 0xaa, b: 0xbb});

		assert.strictEqual(ColorParser('foobar'), null);
		assert.strictEqual(ColorParser('#eeffgg'), null);
	});
});
