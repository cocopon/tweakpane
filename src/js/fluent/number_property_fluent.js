const MaxNumberFormatter = require('../formatter/max_number_formatter');
const MinNumberFormatter = require('../formatter/min_number_formatter');
const PropertyFluent = require('./property_fluent');

class NumberPropertyFluent extends PropertyFluent {
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
}

module.exports = NumberPropertyFluent;
