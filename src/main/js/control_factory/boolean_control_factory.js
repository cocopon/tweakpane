const BooleanModel    = require('../model/boolean_model');
const ListConstraint  = require('../constraint/list_constraint');
const CheckboxControl = require('../view/control/checkbox_control');
const ListControl     = require('../view/control/list_control');
const ControlFactory  = require('./control_factory');

class BooleanControlFactory extends ControlFactory {
	static supports(value) {
		return typeof(value) === 'boolean';
	}

	static getControlClass_(options) {
		if (options.list !== undefined) {
			return ListControl;
		}

		return CheckboxControl;
	}

	static instanciateModel_() {
		return new BooleanModel();
	}
}

BooleanControlFactory.CONSTRAINT_FACTORIES = {
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

module.exports = BooleanControlFactory;
