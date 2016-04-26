const Model = require('./model');

class NumberModel extends Model {
	constructor() {
		super();

		this.value_ = 0.0;
	}

	static validate(value) {
		return typeof(value) === 'number';
	}
}

module.exports = NumberModel;
