import Constraint from './constraint';

class MaxNumberConstraint extends Constraint {
	constructor(maxValue) {
		super();

		this.maxValue_ = maxValue;
	}

	getMaxValue() {
		return this.maxValue_;
	}

	constrain(value) {
		return (this.maxValue_ !== null) ?
			Math.min(value, this.maxValue_) :
			value;
	}
}

module.exports = MaxNumberConstraint;
