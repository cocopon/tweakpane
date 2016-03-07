const DefaultBooleanConstraint = require('../constraint/default_boolean_constraint');
const Model                    = require('./model');

class BooleanModel extends Model {
	constructor() {
		super();

		this.value_ = false;
		this.addConstraint(new DefaultBooleanConstraint());
	}

	validate(value) {
		return typeof(value) === 'boolean';
	}
}

module.exports = BooleanModel;
