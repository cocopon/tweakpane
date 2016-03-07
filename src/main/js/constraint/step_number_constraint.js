const Constraint = require('./constraint');

class StepNumberConstraint extends Constraint {
	constructor() {
		super();

		this.stepValue_ = null;
	}

	getStep() {
		return this.stepValue_;
	}

	setStepValue(stepValue) {
		this.stepValue_ = stepValue;
		this.getEmitter().notifyObservers(Constraint.EVENT_CHANGE);
	}

	format(value) {
		return (this.stepValue_ !== null) ?
			value - value % this.stepValue_ :
			value;
	}
}

module.exports = StepNumberConstraint;
