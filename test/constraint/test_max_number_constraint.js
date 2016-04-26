const MaxNumberConstraint = require('../../src/main/js/constraint/max_number_constraint');

describe('MaxNumberConstraint', () => {
	it('should set value', () => {
		const c = new MaxNumberConstraint(3.1416);

		assert.strictEqual(c.getMaxValue(), 3.1416);
	});

	it('should constraint value', () => {
		const c = new MaxNumberConstraint(100.0);

		assert.strictEqual(c.constrain(99.9), 99.9);
		assert.strictEqual(c.constrain(100.0), 100.0);
		assert.strictEqual(c.constrain(100.1), 100.0);
	});
});
