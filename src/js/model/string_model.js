const Model = require('./model');

class StringModel extends Model {
	constructor() {
		super();

		this.value_ = '';
	}

	validate(value) {
		return typeof(value) === 'string';
	}
}

module.exports = StringModel;
