const MaxNumberConstraint = require('../../src/main/js/constraint/max_number_constraint');
const Constraint          = require('../../src/main/js/model/model');

describe('MaxNumberConstraint', () => {
	it('should not constrain value by default', () => {
		const c = new MaxNumberConstraint();

		assert.strictEqual(c.format(-273.15), -273.15);
		assert.strictEqual(c.format(3.1416), 3.1416);
	});

	it('should have null value by default', () => {
		const c = new MaxNumberConstraint();

		assert.isNull(c.getMaxValue());
	});

	it('should set value', () => {
		const c = new MaxNumberConstraint();

		c.setMaxValue(3.1416);
		assert.strictEqual(c.getMaxValue(), 3.1416);
	});

	it('should fire change event', () => {
		const c = new MaxNumberConstraint();

		const spy = sinon.spy();
		c.getEmitter().on(
			Constraint.EVENT_CHANGE,
			spy
		);
		c.setMaxValue(100);

		assert.isTrue(spy.calledOnce);
	});

	it('should constraint value', () => {
		const c = new MaxNumberConstraint();

		c.setMaxValue(100.0);

		assert.strictEqual(c.format(99.9), 99.9);
		assert.strictEqual(c.format(100.0), 100.0);
		assert.strictEqual(c.format(100.1), 100.0);
	});
});
