const PropertyModel = require('./property_model');

class StringModel extends PropertyModel {
	constructor() {
		super();

		this.value_ = '';
	}

	static validate(value) {
		return typeof(value) === 'string';
	}
}

module.exports = StringModel;
