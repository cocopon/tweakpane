const DefaultNumberDisplay = require('../display/default_number_display');
const ListConstraint       = require('../constraint/list_constraint');
const MaxNumberConstraint  = require('../constraint/max_number_constraint');
const MinNumberConstraint  = require('../constraint/min_number_constraint');
const NumberModel          = require('../model/number_model');
const ListControl          = require('../view/control/list_control');
const SliderTextControl    = require('../view/control/slider_text_control');
const TextControl          = require('../view/control/text_control');
const PropertyController   = require('./property_controller');

class NumberPropertyController extends PropertyController {
	constructor(target, propName) {
		super(target, propName);

		this.display_ = new DefaultNumberDisplay();

		const ControlClass = this.getPreferredControlClass_();
		const model = this.getProperty().getModel();
		this.setControl_(new ControlClass(model));
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

		if (model.findConstraintByClass(MinNumberConstraint) !== null &&
				model.findConstraintByClass(MaxNumberConstraint) !== null) {
			return SliderTextControl;
		}
		if (model.findConstraintByClass(ListConstraint) !== null) {
			return ListControl;
		}

		return TextControl;
	}

	getTextControl_() {
		const control = this.getView().getControl();

		if (control instanceof TextControl) {
			return control;
		}
		if (control instanceof SliderTextControl) {
			return control.getSubviews().filter((subview) => {
				return subview instanceof TextControl;
			})[0];
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
			const model = this.getProperty().getModel();
			this.setControl_(new ControlClass(model));
		}

		super.applyModel_();
	}
}

module.exports = NumberPropertyController;
