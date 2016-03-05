const BooleanPropertyController = require('../controller/boolean_property_controller');
const NumberPropertyController = require('../controller/number_property_controller');
const StringPropertyController = require('../controller/string_property_controller');

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
			controller = new StringPropertyController(target, propName);
		}

		if (controller !== null) {
			controller.applySourceValue();
		}

		return controller;
	}
}

module.exports = PropertyControllerProvider;
