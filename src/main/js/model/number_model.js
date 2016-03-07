const DefaultNumberConstraint = require('../constraint/default_number_constraint');
const Model                  = require('./model');

class NumberModel extends Model {
	constructor() {
		super();

		this.value_ = 0.0;
		this.addConstraint(new DefaultNumberConstraint());
	}

	validate(value) {
		return !isNaN(Number(value));
	}
}

module.exports = NumberModel;
