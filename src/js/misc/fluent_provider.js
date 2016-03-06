const NumberPropertyController = require('../controller/number_property_controller');
const NumberPropertyFluent = require('../fluent/number_property_fluent');
const PropertyFluent = require('../fluent/property_fluent');
const StringPropertyController = require('../controller/string_property_controller');
const StringPropertyFluent = require('../fluent/string_property_fluent');

class FluentProvider {
	static provide(controller) {
		if (controller instanceof NumberPropertyController) {
			return new NumberPropertyFluent(controller);
		}
		if (controller instanceof StringPropertyController) {
			return new StringPropertyFluent(controller);
		}

		return new PropertyFluent(controller);
	}
}

module.exports = FluentProvider;
