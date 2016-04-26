const BooleanModel         = require('../model/boolean_model');
const ListConstraint       = require('../constraint/list_constraint');
const CheckboxControl      = require('../view/control/checkbox_control');
const ListControl          = require('../view/control/list_control');
const PropertyViewFactory  = require('./property_view_factory');

class BooleanPropertyViewFactory extends PropertyViewFactory {
	static supports(value) {
		return typeof(value) === 'boolean';
	}

	static createModel_() {
		return new BooleanModel();
	}

	static createControl_(model, options) {
		if (options.list !== undefined) {
			return new ListControl(model);
		}

		return new CheckboxControl(model);
	}
}

BooleanPropertyViewFactory.CONSTRAINT_FACTORIES = {
	/**
	 * Set the list of values.
	 * @param {string[]} items The list of display texts for true and false value.
	 * @return {Constraint}
	 */
	'list': (items) => {
		return new ListConstraint(
			items.map((item, index) => {
				return {
					name: item,
					value: (index === 0)
				};
			})
		);
	}
};

module.exports = BooleanPropertyViewFactory;
