const ListConstraint      = require('../constraint/list_constraint');
const StringModel         = require('../model/string_model');
const ListControl         = require('../view/control/list_control');
const TextControl         = require('../view/control/text_control');
const PropertyViewFactory = require('./property_view_factory');

class StringPropertyViewFactory extends PropertyViewFactory {
	static supports(value) {
		return typeof(value) === 'string';
	}

	static getControlClass_(options) {
		if (options.list !== undefined) {
			return ListControl;
		}

		return TextControl;
	}

	static instanciateModel_() {
		return new StringModel();
	}

	static createListItems_(items) {
		// ['foo', 'bar']
		// => {'foo': 'foo', 'bar': 'bar'}
		if (Array.isArray(items)) {
			return items.map((value) => {
				return {
					name: value,
					value: value
				};
			});
		}

		const isObjectLiteral = Object.prototype.toString.call(items) === '[object Object]';
		if (isObjectLiteral) {
			return Object.keys(items).map((key) => {
				return {
					name: key,
					value: items[key]
				};
			});
		}

		return null;
	}
}

StringPropertyViewFactory.CONSTRAINT_FACTORIES = {
	/**
	 * Create the list of values constraint.
	 * @param {(string[]|Object.<string, string>)} items The list of values.
	 * @return {Constraint}
	 */
	'list': (items) => {
		return new ListConstraint(
			StringPropertyViewFactory.createListItems_(items)
		);
	}
};

module.exports = StringPropertyViewFactory;
