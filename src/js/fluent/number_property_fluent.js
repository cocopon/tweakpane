const MaxNumberFormatter  = require('../formatter/max_number_formatter');
const MinNumberFormatter  = require('../formatter/min_number_formatter');
const StepNumberFormatter = require('../formatter/step_number_formatter');
const PropertyFluent      = require('./property_fluent');

class NumberPropertyFluent extends PropertyFluent {
	/**
	 * Set the minimum value.
	 * @param {number} minValue The minimum value.
	 * @return {NumberPropertyFluent}
	 */
	min(minValue) {
		const model = this.getController().getModel();
		let formatter = model.findFormatterByClass(MinNumberFormatter);
		if (formatter === null) {
			formatter = new MinNumberFormatter();
			model.addFormatter(formatter);
		}

		formatter.setMinValue(minValue);
		
		return this;
	}

	/**
	 * Set the maximum value.
	 * @param {number} maxValue The maximum value.
	 * @return {NumberPropertyFluent}
	 */
	max(maxValue) {
		const model = this.getController().getModel();
		let formatter = model.findFormatterByClass(MaxNumberFormatter);
		if (formatter === null) {
			formatter = new MaxNumberFormatter();
			model.addFormatter(formatter);
		}

		formatter.setMaxValue(maxValue);
		
		return this;
	}

	/**
	 * Set the step value.
	 * @param {number} stepValue The step value.
	 * @return {NumberPropertyFluent}
	 */
	step(stepValue) {
		const model = this.getController().getModel();
		let formatter = model.findFormatterByClass(StepNumberFormatter);
		if (formatter === null) {
			formatter = new StepNumberFormatter();
			model.addFormatter(formatter);
		}

		formatter.setStepValue(stepValue);
		
		return this;
	}
}

module.exports = NumberPropertyFluent;
