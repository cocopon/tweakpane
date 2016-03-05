const Model = require('./model');

class BooleanModel extends Model {
	constructor() {
		super();

		this.value_ = false;
	}

	validate(value) {
		return typeof(value) === 'boolean';
	}

	// TODO: Default formatter
	// format(value) {
	// 	return !!value;
	// }
}

module.exports = BooleanModel;
