const Display = require('./display');

class DefaultNumberDisplay extends Display {
	display(value) {
		return value.toPrecision(3);
	}
}

module.exports = DefaultNumberDisplay;
