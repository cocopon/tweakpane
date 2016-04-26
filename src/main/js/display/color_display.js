const ColorCodec = require('../codec/color_codec');
const Display    = require('./display');

class ColorDisplay extends Display {
	display(value) {
		return ColorCodec.encode(value);
	}
}

module.exports = ColorDisplay;
