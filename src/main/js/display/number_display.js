const Display = require('./display');

class NumberDisplay extends Display {
	display(value) {
		return value.toPrecision(3);
	}
}

module.exports = NumberDisplay;
