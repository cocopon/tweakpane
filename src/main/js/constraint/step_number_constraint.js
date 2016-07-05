import Constraint from './constraint';

class StepNumberConstraint extends Constraint {
	constructor(stepValue) {
		super();

		this.stepValue_ = stepValue;
	}

	getStepValue() {
		return this.stepValue_;
	}

	constrain(value) {
		return (this.stepValue_ !== null) ?
			value - value % this.stepValue_ :
			value;
	}
}

module.exports = StepNumberConstraint;
