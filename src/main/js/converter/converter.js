const Errors = require('../misc/errors');

class Converter {
	static canConvert(stringValue) {
		throw Errors.notImplemented('canConvert');
	}

	static convert(stringValue) {
		throw Errors.notImplemented('convert');
	}
}

module.exports = Converter;
