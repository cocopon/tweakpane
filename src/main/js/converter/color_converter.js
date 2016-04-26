const Errors    = require('../misc/errors');
const Converter = require('./converter');

class ColorConverter extends Converter {
	static canConvert(stringValue) {
		return this.VALIDATION_PATTERN.test(stringValue);
	}

	static convert(stringValue) {
		if (this.SHORT_PATTERN.test(stringValue)) {
			// '#rgb'
			return [
				parseInt(stringValue.substr(1, 1), 16),
				parseInt(stringValue.substr(2, 1), 16),
				parseInt(stringValue.substr(3, 1), 16)
			].map((c) => {
				return (c << 4) | c;
			});
		}

		if (this.LONG_PATTERN.test(stringValue)) {
			// '#rrggbb'
			return [
				parseInt(stringValue.substr(1, 2), 16),
				parseInt(stringValue.substr(3, 2), 16),
				parseInt(stringValue.substr(5, 2), 16)
			];
		}

		throw Errors.shouldNotHappen();
	}
}

ColorConverter.VALIDATION_PATTERN = /^#[0-9a-f]{3}|[0-9a-f]{6}$/i;
ColorConverter.SHORT_PATTERN = /^#[0-9a-f]{3}$/i;
ColorConverter.LONG_PATTERN = /^#[0-9a-f]{6}$/i;

module.exports = ColorConverter;
