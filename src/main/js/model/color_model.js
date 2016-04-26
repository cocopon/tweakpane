const Model      = require('./model');

class ColorModel extends Model {
	constructor() {
		super();

		this.value_ = [0, 0, 0];
	}

	static validate(value) {
		if (!Array.isArray(value) || value.length !== 3) {
			return false;
		}

		return value.every((comp) => {
			return typeof(comp) === 'number';
		});
	}
}

module.exports = ColorModel;
