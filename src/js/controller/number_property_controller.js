const MaxNumberFormatter = require('../formatter/max_number_formatter');
const MinNumberFormatter = require('../formatter/min_number_formatter');
const NumberModel        = require('../model/number_model');
const SliderTextControl  = require('../view/control/slider_text_control');
const TextControl        = require('../view/control/text_control');
const PropertyController = require('./property_controller');

class NumberPropertyController extends PropertyController {
	constructor(target, propName) {
		super(target, propName);

		const ControlClass = this.getPreferredControlClass_();
		this.setControl_(new ControlClass(this.getModel()));
	}

	instanciateModel_() {
		return new NumberModel();
	}

	getPreferredControlClass_() {
		const model = this.model_;
		if (model.findFormatterByClass(MinNumberFormatter) !== null &&
				model.findFormatterByClass(MaxNumberFormatter) !== null) {
			return SliderTextControl;
		}

		return TextControl;
	}

	applyModel_() {
		const ControlClass = this.getPreferredControlClass_();
		if (!(this.getView().getControl() instanceof ControlClass)) {
			this.setControl_(new ControlClass(this.getModel()));
		}

		super.applyModel_();
	}
}

module.exports = NumberPropertyController;
