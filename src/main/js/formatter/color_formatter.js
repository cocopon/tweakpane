const ColorCodec = require('../codec/color_codec');
const Formatter  = require('./formatter');

class ColorFormatter extends Formatter {
	format(value) {
		return ColorCodec.encode(value);
	}
}

module.exports = ColorFormatter;
