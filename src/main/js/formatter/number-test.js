// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import NumberFormatter from './number';

describe(NumberFormatter.name, () => {
	it('should get digits', () => {
		const f = new NumberFormatter(3);
		assert.strictEqual(f.digits, 3);
	});

	it('should format number', () => {
		assert.strictEqual(
			(new NumberFormatter(2)).format(0),
			'0.00',
		);
		assert.strictEqual(
			(new NumberFormatter(0)).format(3.14),
			'3',
		);
		assert.strictEqual(
			(new NumberFormatter(2)).format(141.41356),
			'141.41',
		);
	});
});
