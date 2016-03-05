const Formatter = require('./formatter');

class DefaultBooleanFormatter extends Formatter {
	format(value) {
		return !!value;
	}
}

module.exports = DefaultBooleanFormatter;
