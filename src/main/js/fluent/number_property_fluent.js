const MaxNumberConstraint  = require('../constraint/max_number_constraint');
const MinNumberConstraint  = require('../constraint/min_number_constraint');
const StepNumberConstraint = require('../constraint/step_number_constraint');
const PropertyFluent       = require('./property_fluent');

class NumberPropertyFluent extends PropertyFluent {
	/**
	 * Set the minimum value.
	 * @param {number} minValue The minimum value.
	 * @return {NumberPropertyFluent}
	 */
	min(minValue) {
		const model = this.getController().getProperty().getModel();
		let constraint = model.findConstraintByClass(MinNumberConstraint);
		if (constraint === null) {
			constraint = new MinNumberConstraint();
			model.addConstraint(constraint);
		}

		constraint.setMinValue(minValue);
		
		return this;
	}

	/**
	 * Set the maximum value.
	 * @param {number} maxValue The maximum value.
	 * @return {NumberPropertyFluent}
	 */
	max(maxValue) {
		const model = this.getController().getProperty().getModel();
		let constraint = model.findConstraintByClass(MaxNumberConstraint);
		if (constraint === null) {
			constraint = new MaxNumberConstraint();
			model.addConstraint(constraint);
		}

		constraint.setMaxValue(maxValue);
		
		return this;
	}

	/**
	 * Set the step value.
	 * @param {number} stepValue The step value.
	 * @return {NumberPropertyFluent}
	 */
	step(stepValue) {
		const model = this.getController().getProperty().getModel();
		let constraint = model.findConstraintByClass(StepNumberConstraint);
		if (constraint === null) {
			constraint = new StepNumberConstraint();
			model.addConstraint(constraint);
		}

		constraint.setStepValue(stepValue);
		
		return this;
	}
}

module.exports = NumberPropertyFluent;
