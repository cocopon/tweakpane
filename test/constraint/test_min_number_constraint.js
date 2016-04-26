const MinNumberConstraint = require('../../src/main/js/constraint/min_number_constraint');

describe('MinNumberConstraint', () => {
	it('should set value', () => {
		const c = new MinNumberConstraint(3.1416);

		assert.strictEqual(c.getMinValue(), 3.1416);
	});

	it('should constraint value', () => {
		const c = new MinNumberConstraint(-100.0);

		assert.strictEqual(c.constrain(-99.9), -99.9);
		assert.strictEqual(c.constrain(-100.0), -100.0);
		assert.strictEqual(c.constrain(-100.1), -100.0);
	});
});
