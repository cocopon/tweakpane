const Constraint = require('./constraint');

class MinNumberConstraint extends Constraint {
	constructor() {
		super();

		this.minValue_ = null;
	}

	getMinValue() {
		return this.minValue_;
	}

	setMinValue(minValue) {
		this.minValue_ = minValue;
		this.getEmitter().notifyObservers(Constraint.EVENT_CHANGE);
	}

	format(value) {
		return (this.minValue_ !== null) ?
			Math.max(value, this.minValue_) :
			value;
	}
}

module.exports = MinNumberConstraint;
