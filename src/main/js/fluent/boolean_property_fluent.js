const ListConstraint = require('../constraint/list_constraint');
const PropertyFluent = require('./property_fluent');

class BooleanPropertyFluent extends PropertyFluent {
	/**
	 * Set the list of values.
	 * @param {string} trueName The display text for true value.
	 * @param {string} falseName The display text for false value.
	 * @return {StringPropertyFluent}
	 */
	list(trueName, falseName) {
		const model = this.getController().getProperty().getModel();
		let constraint = model.findConstraintByClass(ListConstraint);
		if (constraint === null) {
			constraint = new ListConstraint();
			model.addConstraint(constraint);
		}

		constraint.setItems([
			{name: trueName, value: true},
			{name: falseName, value: false}
		]);

		return this;
	}
}

module.exports = BooleanPropertyFluent;
