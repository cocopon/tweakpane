const NumberFormatter = require('../../formatter/number_formatter');
const TextMonitor     = require('./text_monitor');

class NumberTextMonitor extends TextMonitor {
	constructor(model) {
		super(model);

		this.formatter_ = new NumberFormatter();
	}
}

module.exports = NumberTextMonitor;
