const Formatter = require('./formatter');

class DefaultNumberFormatter extends Formatter {
	format(value) {
		return Number(value);
	}
}

module.exports = DefaultNumberFormatter;
