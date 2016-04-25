const ColorModel              = require('../model/color_model');
const ColorPaletteTextControl = require('../view/control/color_palette_text_control');
const PropertyViewFactory     = require('./property_view_factory');

class ColorPropertyViewFactory extends PropertyViewFactory {
	static supports(value) {
		return typeof(value) === 'string' &&
			ColorModel.validate(value);
	}

	static getControlClass_() {
		return ColorPaletteTextControl;
	}

	static instanciateModel_() {
		return new ColorModel();
	}
}

ColorPropertyViewFactory.CONSTRAINT_FACTORIES = {};

module.exports = ColorPropertyViewFactory;
