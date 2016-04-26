const NumberDisplay = require('../../display/number_display');
const TextMonitor   = require('./text_monitor');

class NumberTextMonitor extends TextMonitor {
	constructor(model) {
		super(model);

		this.display_ = new NumberDisplay();
	}
}

module.exports = NumberTextMonitor;
