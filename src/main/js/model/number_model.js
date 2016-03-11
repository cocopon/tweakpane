const Constraint = require('../constraint/constraint');
const Model      = require('./model');

class DefaultNumberConstraint extends Constraint {
	format(value) {
		return Number(value);
	}
}

class NumberModel extends Model {
	constructor() {
		super();

		this.value_ = 0.0;
		this.addConstraint(new DefaultNumberConstraint());
	}

	static validate(value) {
		return !isNaN(Number(value));
	}
}

module.exports = NumberModel;
