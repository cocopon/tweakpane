const Constraint = require('../constraint/constraint');
const Model      = require('./model');

class DefaultBooleanConstraint extends Constraint {
	format(value) {
		return !!value;
	}
}

class BooleanModel extends Model {
	constructor() {
		super();

		this.value_ = false;
		this.addConstraint(new DefaultBooleanConstraint());
	}

	static validate(value) {
		return typeof(value) === 'boolean';
	}
}

module.exports = BooleanModel;
