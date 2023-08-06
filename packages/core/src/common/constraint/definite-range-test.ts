import * as assert from 'assert';
import {describe, it} from 'mocha';

import {DefiniteRangeConstraint} from './definite-range.js';

describe(DefiniteRangeConstraint.name, () => {
	it('should constrain value with minimun and maximum value', () => {
		const c = new DefiniteRangeConstraint({
			max: 123,
			min: -123,
		});
		assert.strictEqual(c.constrain(-124), -123);
		assert.strictEqual(c.constrain(0), 0);
		assert.strictEqual(c.constrain(124), 123);
	});

	it('should constrain value with updated range', () => {
		const c = new DefiniteRangeConstraint({
			max: 1,
			min: 0,
		});
		c.values.set('min', -10);
		c.values.set('max', 10);

		assert.strictEqual(c.constrain(-100), -10);
		assert.strictEqual(c.constrain(100), 10);
	});
});
