const BooleanPropertyController = require('../controller/boolean_property_controller');
const NumberPropertyController  = require('../controller/number_property_controller');
const StringPropertyController  = require('../controller/string_property_controller');
const BooleanPropertyFluent     = require('../fluent/boolean_property_fluent');
const NumberPropertyFluent      = require('../fluent/number_property_fluent');
const PropertyFluent            = require('../fluent/property_fluent');
const StringPropertyFluent      = require('../fluent/string_property_fluent');

class FluentProvider {
	static provide(controller) {
		if (controller instanceof BooleanPropertyController) {
			return new BooleanPropertyFluent(controller);
		}
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
