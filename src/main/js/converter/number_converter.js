const Converter = require('./converter');

class NumberConverter extends Converter {
	static canConvert(stringValue) {
		return !isNaN(Number(stringValue));
	}

	static convert(stringValue) {
		return Number(stringValue);
	}
}

module.exports = NumberConverter;
