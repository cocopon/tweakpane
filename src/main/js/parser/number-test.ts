// @flow

import {assert} from 'chai';
import {describe, it} from 'mocha';

import NumberParser from './number';

describe(NumberParser.name, () => {
	it('should parse number', () => {
		assert.strictEqual(NumberParser('3.14'), 3.14);
		assert.strictEqual(NumberParser('abc'), null);
		assert.strictEqual(NumberParser('1e-3'), 0.001);
	});
});
