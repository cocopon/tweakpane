const NumberModel = require('./number_model');

class NumberRecordModel extends NumberModel {
	constructor(opt_recordCount) {
		super();

		this.recValues_ = [];
		this.recCount_ = (opt_recordCount !== undefined) ?
			opt_recordCount :
			100;
		for (let i = 0; i < this.recCount_; i++) {
			this.recValues_.push(0);
		}
	}

	getRecords() {
		return this.recValues_;
	}

	setValue(value) {
		if (super.setValue(value)) {
			this.recValues_.push(this.value_);

			if (this.recValues_.length > this.recCount_) {
				this.recValues_.splice(0, this.recValues_.length - this.recCount_);
			}
		}
	}
}

module.exports = NumberRecordModel;
