const Formatter = require('./formatter');

class MinNumberFormatter extends Formatter {
	constructor() {
		super();

		this.minValue_ = 0.0;
	}

	getMinValue() {
		return this.minValue_;
	}

	setMinValue(minValue) {
		this.minValue_ = minValue;
		this.getEmitter().notifyObservers(Formatter.EVENT_CHANGE);
	}

	format(value) {
		return Math.max(value, this.minValue_);
	}
}

module.exports = MinNumberFormatter;
