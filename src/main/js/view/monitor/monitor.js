const Property = require('../../model/property');
const View  = require('../view');

class Monitor extends View {
	constructor(property) {
		super();

		property.getEmitter().on(
			Property.EVENT_MODEL_CHANGE,
			this.onModelChange_,
			this
		);
		this.prop_ = property;

		this.timer_ = null;
	}

	getProperty() {
		return this.prop_;
	}

	start(opt_interval) {
		this.stop();

		const interval = (opt_interval !== undefined) ?
			opt_interval :
			(1000 / 20);
		this.timer_ = setInterval(() => {
			this.onTimerTick_();
		}, interval);
	}

	stop() {
		if (this.timer_ === null) {
			return;
		}

		clearInterval(this.timer_);
		this.timer_ = null;
	}

	applyModel_() {
	}

	onModelChange_() {
		this.applyModel_();
	}

	onTimerTick_() {
		this.prop_.applySourceValue();
	}
}

Monitor.BLOCK_CLASS = 'm';

module.exports = Monitor;
