import Model    from '../../model/model';
import View  from '../view';

class Monitor extends View {
	constructor(property) {
		super();

		property.getModel().getEmitter().on(
			Model.EVENT_CHANGE,
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
			Monitor.DEFAULT_INTERVAL;
		if (interval < 0) {
			return;
		}

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
Monitor.DEFAULT_INTERVAL = 100;

export default Monitor;
