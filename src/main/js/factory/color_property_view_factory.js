const ColorCodec          = require('../codec/color_codec');
const ColorModel          = require('../model/color_model');
const PaletteTextControl  = require('../view/control/palette_text_control');
const PaletteTextMonitor  = require('../view/monitor/palette_text_monitor');
const PropertyViewFactory = require('./property_view_factory');

class ColorPropertyViewFactory extends PropertyViewFactory {
	static supports(value) {
		return typeof(value) === 'string' &&
			ColorCodec.canDecode(value);
	}

	static createModel_() {
		return new ColorModel();
	}

	static createControl_(model) {
		return new PaletteTextControl(model);
	}

	static createMonitor_(property) {
		return new PaletteTextMonitor(property);
	}
}

ColorPropertyViewFactory.CONSTRAINT_FACTORIES = {};

module.exports = ColorPropertyViewFactory;
