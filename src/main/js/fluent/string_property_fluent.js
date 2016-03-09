const ListConstraint = require('../constraint/list_constraint');
const PropertyFluent = require('./property_fluent');

class StringPropertyFluent extends PropertyFluent {
	/**
	 * Set the list of values.
	 * @param {(string[]|Object.<string, string>)} values The list of values.
	 * @return {StringPropertyFluent}
	 */
	list(values) {
		const model = this.getController().getProperty().getModel();
		let constraint = model.findConstraintByClass(ListConstraint);
		if (constraint === null) {
			constraint = new ListConstraint();
			model.addConstraint(constraint);
		}

		constraint.setItems(this.createItems_(values));

		return this;
	}

	/**
	 * @private
	 */
	createItems_(values) {
		if (Array.isArray(values)) {
			return values.map((value) => {
				return {
					name: value,
					value: value
				};
			});
		}

		const isObjectLiteral = Object.prototype.toString.call(values) === '[object Object]';
		if (isObjectLiteral) {
			return Object.keys(values).map((key) => {
				return {
					name: key,
					value: values[key]
				};
			});
		}

		return null;
	}
}

module.exports = StringPropertyFluent;
