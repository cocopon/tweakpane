const StepNumberConstraint = require('../../src/main/js/constraint/step_number_constraint');
const Constraint           = require('../../src/main/js/model/model');

describe('StepNumberConstraint', () => {
	it('should not constrain value by default', () => {
		const c = new StepNumberConstraint();

		assert.strictEqual(c.format(-273.15), -273.15);
		assert.strictEqual(c.format(3.1416), 3.1416);
	});

	it('should have null value by default', () => {
		const c = new StepNumberConstraint();

		assert.isNull(c.getStepValue());
	});

	it('should set value', () => {
		const c = new StepNumberConstraint();

		c.setStepValue(10);
		assert.strictEqual(c.getStepValue(), 10);
	});

	it('should fire change event', () => {
		const c = new StepNumberConstraint();

		const spy = sinon.spy();
		c.getEmitter().on(
			Constraint.EVENT_CHANGE,
			spy
		);
		c.setStepValue(100);

		assert.isTrue(spy.calledOnce);
	});

	it('should constraint value', () => {
		const c = new StepNumberConstraint();

		c.setStepValue(10);

		assert.strictEqual(c.format(99), 90);
		assert.strictEqual(c.format(100), 100);
		assert.strictEqual(c.format(101), 100);
	});
});
