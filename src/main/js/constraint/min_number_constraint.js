const Constraint = require('./constraint');

class MinNumberConstraint extends Constraint {
	constructor(minValue) {
		super();

		this.minValue_ = minValue;
	}

	getMinValue() {
		return this.minValue_;
	}

	format(value) {
		return (this.minValue_ !== null) ?
			Math.max(value, this.minValue_) :
			value;
	}
}

module.exports = MinNumberConstraint;
