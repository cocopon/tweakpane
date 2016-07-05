import ColorCodec from '../codec/color_codec';
import Formatter  from './formatter';

class ColorFormatter extends Formatter {
	format(value) {
		return ColorCodec.encode(value);
	}
}

module.exports = ColorFormatter;
