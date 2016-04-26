const NumberModel = require('./number_model');

class NumberHistoryModel extends NumberModel {
	constructor(opt_historyCount) {
		super();

		this.prevValues_ = [];
		this.historyCount_ = (opt_historyCount !== undefined) ?
			opt_historyCount :
			100;
		for (let i = 0; i < this.historyCount_; i++) {
			this.prevValues_.push(0);
		}
	}

	getPreviousValues() {
		return this.prevValues_;
	}

	setValue(value) {
		if (super.setValue(value)) {
			this.prevValues_.push(this.value_);

			if (this.prevValues_.length > this.historyCount_) {
				this.prevValues_.splice(0, this.prevValues_.length - this.historyCount_);
			}
		}
	}
}

module.exports = NumberHistoryModel;
