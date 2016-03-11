const MinNumberConstraint = require('../../src/main/js/constraint/min_number_constraint');
const Constraint          = require('../../src/main/js/model/model');

describe('MinNumberConstraint', () => {
	it('should not constrain value by default', () => {
		const c = new MinNumberConstraint();

		assert.strictEqual(c.format(-273.15), -273.15);
		assert.strictEqual(c.format(3.1416), 3.1416);
	});

	it('should have null value by default', () => {
		const c = new MinNumberConstraint();

		assert.isNull(c.getMinValue());
	});

	it('should set value', () => {
		const c = new MinNumberConstraint();

		c.setMinValue(3.1416);
		assert.strictEqual(c.getMinValue(), 3.1416);
	});

	it('should fire change event', () => {
		const c = new MinNumberConstraint();

		const spy = sinon.spy();
		c.getEmitter().on(
			Constraint.EVENT_CHANGE,
			spy
		);
		c.setMinValue(100);

		assert.isTrue(spy.calledOnce);
	});

	it('should constraint value', () => {
		const c = new MinNumberConstraint();

		c.setMinValue(-100.0);

		assert.strictEqual(c.format(-99.9), -99.9);
		assert.strictEqual(c.format(-100.0), -100.0);
		assert.strictEqual(c.format(-100.1), -100.0);
	});
});
