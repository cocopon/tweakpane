const PropertyModel = require('./property_model');

class NumberModel extends PropertyModel {
	constructor() {
		super();

		this.value_ = 0.0;
	}

	static validate(value) {
		return typeof(value) === 'number';
	}
}

module.exports = NumberModel;
