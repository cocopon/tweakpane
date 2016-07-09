import ColorModel          from '../model/property/color_model';
import PaletteTextControl  from '../view/control/palette_text_control';
import PaletteTextMonitor  from '../view/monitor/palette_text_monitor';
import PropertyViewFactory from './property_view_factory';

const CONSTRAINT_FACTORIES = {};

class ColorPropertyViewFactory {
	static createPalette(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		options.forMonitor = false;
		return PropertyViewFactory.create({
			reference: ref,
			constraintFactories: CONSTRAINT_FACTORIES,
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
		options.forMonitor = true;
		return PropertyViewFactory.create({
			reference: ref,
			constraintFactories: CONSTRAINT_FACTORIES,
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

export default ColorPropertyViewFactory;
