const Constraint = require('./constraint');

class DefaultBooleanConstraint extends Constraint {
	format(value) {
		return !!value;
	}
}

module.exports = DefaultBooleanConstraint;
