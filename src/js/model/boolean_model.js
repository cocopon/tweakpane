const DefaultBooleanFormatter = require('../formatter/default_boolean_formatter');
const Model                   = require('./model');

class BooleanModel extends Model {
	constructor() {
		super();

		this.value_ = false;
		this.addFormatter(new DefaultBooleanFormatter());
	}

	validate(value) {
		return typeof(value) === 'boolean';
	}
}

module.exports = BooleanModel;
