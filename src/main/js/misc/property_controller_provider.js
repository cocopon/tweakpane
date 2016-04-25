const BooleanControlFactory = require('../control_factory/boolean_control_factory');
const ColorControlFactory   = require('../control_factory/color_control_factory');
const NumberControlFactory  = require('../control_factory/number_control_factory');
const StringControlFactory  = require('../control_factory/string_control_factory');
const Errors                = require('../misc/errors');

const CONTROL_FACTORIES = [
	BooleanControlFactory,
	ColorControlFactory,
	NumberControlFactory,
	StringControlFactory
];

class PropertyControllerProvider {
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

module.exports = PropertyControllerProvider;
