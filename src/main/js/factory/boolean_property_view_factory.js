const BooleanModel         = require('../model/property/boolean_model');
const ListConstraint       = require('../constraint/list_constraint');
const CheckboxControl      = require('../view/control/checkbox_control');
const ListControl          = require('../view/control/list_control');
const CheckboxMonitor      = require('../view/monitor/checkbox_monitor');
const PropertyViewFactory  = require('./property_view_factory');

class BooleanPropertyViewFactory extends PropertyViewFactory {
	static supports(value) {
		return typeof(value) === 'boolean';
	}

	static createModel_() {
		return new BooleanModel();
	}

	static createControl_(prop, _options) {
		return new CheckboxControl(prop);
	}

	static createMonitor_(property) {
		return new CheckboxMonitor(property);
	}

	static createCheckbox(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		return PropertyViewFactory.create2({
			reference: ref,
			constraintFactories: this.CONSTRAINT_FACTORIES,
			createModel: () => {
				return new BooleanModel();
			},
			createView: (prop) => {
				return new CheckboxControl(prop);
			},
			options: options
		});
	}

	static createSelector(ref, opt_options) {
		const options = (opt_options !== undefined) ?
			opt_options :
			{};
		return PropertyViewFactory.create2({
			reference: ref,
			constraintFactories: this.CONSTRAINT_FACTORIES,
			createModel: () => {
				return new BooleanModel();
			},
			createView: (prop) => {
				return new ListControl(prop);
			},
			options: options
		});
	}
}

BooleanPropertyViewFactory.CONSTRAINT_FACTORIES = {
	/**
	 * Set the list of values.
	 * @param {string[]} items The list of display texts for true and false value.
	 * @return {Constraint}
	 */
	'values': (items) => {
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
