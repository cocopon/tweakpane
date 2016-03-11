const ColorModel              = require('../model/color_model');
const ColorPaletteTextControl = require('../view/control/color_palette_text_control');
const PropertyController      = require('./property_controller');

class ColorPropertyController extends PropertyController {
	constructor(target, propName) {
		super(target, propName);

		this.setControl_(new ColorPaletteTextControl(this.getProperty().getModel()));
	}

	instanciateModel_() {
		return new ColorModel();
	}
}

module.exports = ColorPropertyController;
