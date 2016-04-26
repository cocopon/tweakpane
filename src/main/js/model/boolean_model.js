const Model      = require('./model');

class BooleanModel extends Model {
	constructor() {
		super();

		this.value_ = false;
	}

	static validate(value) {
		return typeof(value) === 'boolean';
	}
}

module.exports = BooleanModel;
