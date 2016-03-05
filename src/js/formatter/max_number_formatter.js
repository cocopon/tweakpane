const Formatter = require('./formatter');

class MaxNumberFormatter extends Formatter {
	constructor() {
		super();

		this.maxValue_ = 1.0;
	}

	getMaxValue() {
		return this.maxValue_;
	}

	setMaxValue(maxValue) {
		this.maxValue_ = maxValue;
		this.getEmitter().notifyObservers(Formatter.EVENT_CHANGE);
	}

	format(value) {
		return Math.min(value, this.maxValue_);
	}
}

module.exports = MaxNumberFormatter;
