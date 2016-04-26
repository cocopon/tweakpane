const ColorCodec              = require('../codec/color_codec');
const ColorModel              = require('../model/color_model');
const ColorPaletteTextControl = require('../view/control/color_palette_text_control');
const PropertyViewFactory     = require('./property_view_factory');

class ColorPropertyViewFactory extends PropertyViewFactory {
	static supports(value) {
		return typeof(value) === 'string' &&
			ColorCodec.canDecode(value);
	}

	static instanciateModel_() {
		return new ColorModel();
	}

	static createControl_(model) {
		return new ColorPaletteTextControl(model);
	}
}

ColorPropertyViewFactory.CONSTRAINT_FACTORIES = {};

module.exports = ColorPropertyViewFactory;
