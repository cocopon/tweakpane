const Constraint = require('../constraint/constraint');
const Model      = require('./model');

class DefaultColorConstraint extends Constraint {
	format(value) {
		// TODO: Implement
		return value;
	}
}

// TODO: Implement
class ColorModel extends Model {
	constructor() {
		super();

		this.value_ = 0.0;
		this.addConstraint(new DefaultColorConstraint());
	}

	static validate(value) {
		return value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
	}
}

module.exports = ColorModel;
