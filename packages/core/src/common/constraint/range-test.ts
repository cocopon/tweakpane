import * as assert from 'assert';
import {describe, it} from 'mocha';

import {RangeConstraint} from './range.js';

describe(RangeConstraint.name, () => {
	it('should constrain value with minimum value', () => {
		const c = new RangeConstraint({
			min: -10,
		});
		assert.strictEqual(c.values.get('min'), -10);
		assert.strictEqual(c.constrain(-11), -10);
		assert.strictEqual(c.constrain(-10), -10);
		assert.strictEqual(c.constrain(-9), -9);
	});

	it('should constrain value with maximum value', () => {
		const c = new RangeConstraint({
			max: 123,
		});
		assert.strictEqual(c.values.get('max'), 123);
		assert.strictEqual(c.constrain(122), 122);
		assert.strictEqual(c.constrain(123), 123);
		assert.strictEqual(c.constrain(123.5), 123);
	});

	it('should constrain value with minimun and maximum value', () => {
		const c = new RangeConstraint({
			max: 123,
			min: -123,
		});
		assert.strictEqual(c.constrain(-124), -123);
		assert.strictEqual(c.constrain(0), 0);
		assert.strictEqual(c.constrain(124), 123);
	});
});
