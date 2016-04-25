const BooleanPropertyViewFactory = require('../factory/boolean_property_view_factory');
const ColorPropertyViewFactory   = require('../factory/color_property_view_factory');
const NumberPropertyViewFactory  = require('../factory/number_property_view_factory');
const StringPropertyViewFactory  = require('../factory/string_property_view_factory');
const Errors                     = require('../misc/errors');

const CONTROL_FACTORIES = [
	BooleanPropertyViewFactory,
	ColorPropertyViewFactory,
	NumberPropertyViewFactory,
	StringPropertyViewFactory
];

class PropertyViewProvider {
	static provide(target, propName, opt_options) {
		const value = target[propName];
		const options = (opt_options !== undefined) ?
			opt_options :
			{};

		let factories = CONTROL_FACTORIES.reduce((results, factory) => {
			return factory.supports(value) ?
				results.concat(factory) :
				results;
		}, []);

		if (factories.length === 0) {
			throw Errors.propertyTypeNotSupported(
				propName,
				target[propName]
			);
		}

		const factory = factories[0];
		return factory.create(target, propName, options);
	}
}

module.exports = PropertyViewProvider;
