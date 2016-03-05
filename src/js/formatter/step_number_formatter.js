const Formatter = require('./formatter');

class StepNumberFormatter extends Formatter {
	constructor() {
		super();

		this.stepValue_ = 1.0;
	}

	getStep() {
		return this.stepValue_;
	}

	setStepValue(stepValue) {
		this.stepValue_ = stepValue;
		this.getEmitter().notifyObservers(Formatter.EVENT_CHANGE);
	}

	format(value) {
		return value - value % this.stepValue_;
	}
}

module.exports = StepNumberFormatter;
