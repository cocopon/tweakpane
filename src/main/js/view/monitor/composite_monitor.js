import Monitor from './monitor';

class CompositeMonitor extends Monitor {
	constructor(property) {
		super(property);
	}

	start(opt_interval) {
		this.getSubviews().forEach((subview) => {
			if (!(subview instanceof Monitor)) {
				return;
			}

			subview.start(opt_interval);
		});
	}

	stop() {
		this.getSubviews().forEach((subview) => {
			if (!(subview instanceof Monitor)) {
				return;
			}

			subview.stop();
		});
	}
}

export default CompositeMonitor;
