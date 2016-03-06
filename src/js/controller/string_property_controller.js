const StringModel = require('../model/string_model');
const TextControl = require('../view/control/text_control');
const PropertyController = require('./property_controller');

class StringPropertyController extends PropertyController {
	constructor(target, propName) {
		super(target, propName);

		this.setControl_(new TextControl(this.getProperty().getModel()));
	}

	instanciateModel_() {
		return new StringModel();
	}
}

module.exports = StringPropertyController;
