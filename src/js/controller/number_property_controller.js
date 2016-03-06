const DefaultNumberDisplay = require('../display/default_number_display');
const MaxNumberFormatter   = require('../formatter/max_number_formatter');
const MinNumberFormatter   = require('../formatter/min_number_formatter');
const NumberModel          = require('../model/number_model');
const SliderTextControl    = require('../view/control/slider_text_control');
const TextControl          = require('../view/control/text_control');
const PropertyController   = require('./property_controller');

class NumberPropertyController extends PropertyController {
	constructor(target, propName) {
		super(target, propName);

		this.display_ = new DefaultNumberDisplay();

		const ControlClass = this.getPreferredControlClass_();
		this.setControl_(new ControlClass(this.getProperty().getModel()));
	}

	getDisplay() {
		return this.display_;
	}

	setDisplay(display) {
		this.display_ = display;
		this.applyDisplay_();
	}

	applyDisplay_() {
		const textControl = this.getTextControl_();
		if (textControl === null) {
			return;
		}

		textControl.setDisplay(this.display_);
	}

	instanciateModel_() {
		return new NumberModel();
	}

	getPreferredControlClass_() {
		const model = this.getProperty().getModel();
		if (model.findFormatterByClass(MinNumberFormatter) !== null &&
				model.findFormatterByClass(MaxNumberFormatter) !== null) {
			return SliderTextControl;
		}

		return TextControl;
	}

	getTextControl_() {
		const control = this.getView().getControl();

		if (control instanceof TextControl) {
			return control;
		}
		if (control instanceof SliderTextControl) {
			return control.getTextControl();
		}
		return null;
	}

	setControl_(control) {
		super.setControl_(control);
		this.applyDisplay_();
	}

	applyModel_() {
		const ControlClass = this.getPreferredControlClass_();
		if (!(this.getView().getControl() instanceof ControlClass)) {
			this.setControl_(new ControlClass(this.getProperty().getModel()));
		}

		super.applyModel_();
	}
}

module.exports = NumberPropertyController;
