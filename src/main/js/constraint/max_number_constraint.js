const Constraint = require('./constraint');

class MaxNumberConstraint extends Constraint {
	constructor(maxValue) {
		super();

		this.maxValue_ = maxValue;
	}

	getMaxValue() {
		return this.maxValue_;
	}

	format(value) {
		return (this.maxValue_ !== null) ?
			Math.min(value, this.maxValue_) :
			value;
	}
}

module.exports = MaxNumberConstraint;
