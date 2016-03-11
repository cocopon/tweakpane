const BooleanPropertyController = require('../controller/boolean_property_controller');
const ColorPropertyController   = require('../controller/color_property_controller');
const NumberPropertyController  = require('../controller/number_property_controller');
const StringPropertyController  = require('../controller/string_property_controller');
const Errors                    = require('../misc/errors');
const ColorModel                = require('../model/color_model');

class PropertyControllerProvider {
	static provide(target, propName) {
		const value = target[propName];
		let controller = null;

		if (typeof(value) === 'boolean') {
			controller = new BooleanPropertyController(target, propName);
		}
		if (typeof(value) === 'number') {
			controller = new NumberPropertyController(target, propName);
		}
		if (typeof(value) === 'string') {
			if (ColorModel.validate(value)) {
				controller = new ColorPropertyController(target, propName);
			}
			else {
				controller = new StringPropertyController(target, propName);
			}
		}

		if (controller === null) {
			throw Errors.propertyTypeNotSupported(
				propName,
				target[propName]
			);
		}

		controller.getProperty().applySourceValue();
		return controller;
	}
}

module.exports = PropertyControllerProvider;
