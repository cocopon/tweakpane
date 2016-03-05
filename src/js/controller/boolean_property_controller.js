const BooleanModel = require('../model/boolean_model');
const CheckboxControl = require('../view/control/checkbox_control');
const PropertyController = require('./property_controller');

class BooleanPropertyController extends PropertyController {
	constructor(target, propName) {
		super(target, propName);

		this.setControl_(new CheckboxControl(this.getModel()));
	}

	instanciateModel_() {
		return new BooleanModel();
	}
}

module.exports = BooleanPropertyController;
