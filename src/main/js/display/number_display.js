const Display = require('./display');

class NumberDisplay extends Display {
	display(value) {
		// Workaround for vanishingly small error:
		// e.g.
		// 4.0 + 0.1 + 0.1 = 4.199999999999999 => 4.2
		const roundedValue = Math.round(value * 1e14) / 1e14;

		// Workaround for repeating decimal:
		// e.g. 1 / 3 = 0.3333333333333333 => 0.33
		const stringValue = roundedValue.toString();
		const matches = stringValue.match(/\.\d(\d+)\d$/);
		if (matches === null) {
			return roundedValue.toString();
		}

		const mediumDigits = matches[1];
		const firstDigit = mediumDigits.charAt(0);
		const repeated = mediumDigits.split('').every((ch) => {
			return firstDigit === ch;
		});
		return repeated ?
			roundedValue.toPrecision(3) :
			roundedValue.toString();
	}
}

module.exports = NumberDisplay;
