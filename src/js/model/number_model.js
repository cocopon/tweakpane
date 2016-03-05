const Model = require('./model');

class NumberModel extends Model {
	constructor() {
		super();

		this.value_ = 0.0;
		this.minValue_ = null;
		this.maxValue_ = null;
	}

	validate(value) {
		return !isNaN(Number(value));
	}

	format(value) {
		let v = Number(value);

		if (this.minValue_ !== null) {
			v = Math.max(v, this.minValue_);
		}
		if (this.maxValue_ !== null) {
			v = Math.min(v, this.maxValue_);
		}

		return v;
	}

	hasMinValue() {
		return this.minValue_ !== null;
	}

	getMinValue() {
		return this.minValue_;
	}

	setMinValue(minValue) {
		this.minValue_ = minValue;
		this.value_ = Math.max(this.value_, this.minValue_);
		this.emitter_.notifyObservers(Model.EVENT_CHANGE);
	}

	hasMaxValue() {
		return this.maxValue_ !== null;
	}

	getMaxValue() {
		return this.maxValue_;
	}

	setMaxValue(maxValue) {
		this.maxValue_ = maxValue;
		this.value_ = Math.min(this.value_, this.maxValue_);
		this.emitter_.notifyObservers(Model.EVENT_CHANGE);
	}
}

module.exports = NumberModel;
