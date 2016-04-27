const StringModel = require('./string_model');

class StringRecordModel extends StringModel {
	constructor(opt_recordCount) {
		super();

		this.recValues_ = [];
		this.recCount_ = (opt_recordCount !== undefined) ?
			opt_recordCount :
			10;
		for (let i = 0; i < this.recCount_; i++) {
			this.recValues_.push('');
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

module.exports = StringRecordModel;
