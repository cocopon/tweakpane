const Converter = require('./converter');

class BooleanConverter extends Converter {
	static canConvert(stringValue) {
		return !isNaN(Number(stringValue));
	}

	static convert(stringValue) {
		return Number(stringValue) !== 0;
	}
}

module.exports = BooleanConverter;
