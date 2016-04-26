const StepNumberConstraint = require('../../src/main/js/constraint/step_number_constraint');

describe('StepNumberConstraint', () => {
	it('should set value', () => {
		const c = new StepNumberConstraint(10);

		assert.strictEqual(c.getStepValue(), 10);
	});

	it('should constraint value', () => {
		const c = new StepNumberConstraint(10);

		assert.strictEqual(c.constrain(99), 90);
		assert.strictEqual(c.constrain(100), 100);
		assert.strictEqual(c.constrain(101), 100);
	});
});
