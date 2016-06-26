const ColorCodec          = require('../codec/color_codec');
const ColorModel          = require('../model/property/color_model');
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

	static createControl_(prop) {
		return new PaletteTextControl(prop);
	}

	static createMonitor_(property) {
		return new PaletteTextMonitor(property);
	}

	static createPalette(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		return PropertyViewFactory.create2({
			reference: ref,
			constraintFactories: this.CONSTRAINT_FACTORIES,
			createModel: () => {
				return new ColorModel();
			},
			createView: (prop) => {
				return new PaletteTextControl(prop);
			},
			options: options
		});
	}
}

ColorPropertyViewFactory.CONSTRAINT_FACTORIES = {};

module.exports = ColorPropertyViewFactory;
