const ListConstraint     = require('../constraint/list_constraint');
const StringModel        = require('../model/string_model');
const ListControl        = require('../view/control/list_control');
const TextControl        = require('../view/control/text_control');
const PropertyController = require('./property_controller');

class StringPropertyController extends PropertyController {
	constructor(target, propName) {
		super(target, propName);

		const ControlClass = this.getPreferredControlClass_();
		const model = this.getProperty().getModel();
		this.setControl_(new ControlClass(model));
	}

	instanciateModel_() {
		return new StringModel();
	}

	getPreferredControlClass_() {
		const model = this.getProperty().getModel();
		if (model.findConstraintByClass(ListConstraint) !== null) {
			return ListControl;
		}

		return TextControl;
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

module.exports = StringPropertyController;
