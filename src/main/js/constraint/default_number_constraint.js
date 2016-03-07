const Constraint = require('./constraint');

class DefaultNumberConstraint extends Constraint {
	format(value) {
		return Number(value);
	}
}

module.exports = DefaultNumberConstraint;
