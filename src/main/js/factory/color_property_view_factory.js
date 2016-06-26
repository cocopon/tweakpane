const ColorModel          = require('../model/property/color_model');
const PaletteTextControl  = require('../view/control/palette_text_control');
const PaletteTextMonitor  = require('../view/monitor/palette_text_monitor');
const PropertyViewFactory = require('./property_view_factory');

class ColorPropertyViewFactory {
	static createPalette(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		return PropertyViewFactory.create({
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

	static createMonitor(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		return PropertyViewFactory.create({
			reference: ref,
			constraintFactories: this.CONSTRAINT_FACTORIES,
			createModel: () => {
				return new ColorModel();
			},
			createView: (prop) => {
				return new PaletteTextMonitor(prop);
			},
			options: options
		});
	}
}

ColorPropertyViewFactory.CONSTRAINT_FACTORIES = {};

module.exports = ColorPropertyViewFactory;
