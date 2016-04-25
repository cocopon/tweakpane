const Constraint = require('./constraint');

class StepNumberConstraint extends Constraint {
	constructor(stepValue) {
		super();

		this.stepValue_ = stepValue;
	}

	getStepValue() {
		return this.stepValue_;
	}

	format(value) {
		return (this.stepValue_ !== null) ?
			value - value % this.stepValue_ :
			value;
	}
}

module.exports = StepNumberConstraint;
