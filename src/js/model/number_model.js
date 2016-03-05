const DefaultNumberFormatter = require('../formatter/default_number_formatter');
const Model                  = require('./model');

class NumberModel extends Model {
	constructor() {
		super();

		this.value_ = 0.0;
		this.addFormatter(new DefaultNumberFormatter());
	}

	validate(value) {
		return !isNaN(Number(value));
	}
}

module.exports = NumberModel;
