const Constraint = require('./constraint');

class MaxNumberConstraint extends Constraint {
	constructor() {
		super();

		this.maxValue_ = null;
	}

	getMaxValue() {
		return this.maxValue_;
	}

	setMaxValue(maxValue) {
		this.maxValue_ = maxValue;
		this.getEmitter().notifyObservers(Constraint.EVENT_CHANGE);
	}

	format(value) {
		return (this.maxValue_ !== null) ?
			Math.min(value, this.maxValue_) :
			value;
	}
}

module.exports = MaxNumberConstraint;
