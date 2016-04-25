const ColorModel              = require('../model/color_model');
const ColorPaletteTextControl = require('../view/control/color_palette_text_control');
const ControlFactory          = require('./control_factory');

class ColorControlFactory extends ControlFactory {
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

ColorControlFactory.CONSTRAINT_FACTORIES = {};

module.exports = ColorControlFactory;
