const BooleanPropertyViewFactory = require('../factory/boolean_property_view_factory');
const ColorPropertyViewFactory   = require('../factory/color_property_view_factory');
const NumberPropertyViewFactory  = require('../factory/number_property_view_factory');
const StringPropertyViewFactory  = require('../factory/string_property_view_factory');
const Errors                     = require('../misc/errors');

const FACTORIES = [
	BooleanPropertyViewFactory,
	ColorPropertyViewFactory,
	NumberPropertyViewFactory,
	StringPropertyViewFactory
];

class PropertyViewFactoryComplex {
	static create(ref, options) {
		if (ref.getValue() === undefined) {
			throw Errors.propertyNotFound(ref.getPropertyName());
		}

		const factory = this.getFactory_(ref);
		if (factory === null) {
			throw Errors.propertyTypeNotSupported(
				ref.getPropertyName(),
				ref.getValue()
			);
		}
		return factory.create(ref, options);
	}

	static getFactory_(ref) {
		const value = ref.getValue();
		let factories = FACTORIES.reduce((results, factory) => {
			return factory.supports(value) ?
				results.concat(factory) :
				results;
		}, []);

		return (factories.length !== 0) ?
			factories[0] :
			null;
	}
}

module.exports = PropertyViewFactoryComplex;
