// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import * as NumberConverter from './number';

describe('NumberConverter', () => {
	it('should convert mixed to number', () => {
		assert.strictEqual(
			NumberConverter.fromMixed(3.14),
			3.14,
		);
		assert.strictEqual(
			NumberConverter.fromMixed('1.4141356'),
			1.4141356,
		);
		assert.strictEqual(
			NumberConverter.fromMixed('foobar'),
			0,
		);
		assert.strictEqual(
			NumberConverter.fromMixed({foo: 'bar'}),
			0,
		);
	});

	it('should convert number to string', () => {
		assert.strictEqual(
			NumberConverter.toString(3.14),
			'3.14',
		);
	});
});
