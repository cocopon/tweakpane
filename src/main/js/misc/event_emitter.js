class EventEmitter {
	constructor() {
		this.observers_ = {};
	}

	on(eventName, handler, opt_scope) {
		let observers = this.observers_[eventName];
		if (observers === undefined) {
			observers = this.observers_[eventName] = [];
		}

		observers.push({
			handler: handler,
			opt_scope: opt_scope
		});
	}

	off(eventName, handler) {
		let observers = this.observers_[eventName];

		observers = observers.filter((observer) => {
			return observer.handler !== handler;
		});
	}

	notifyObservers(eventName, opt_args) {
		const observers = this.observers_[eventName];
		if (observers === undefined) {
			return;
		}

		observers.forEach((observer) => {
			const scope = (observer.opt_scope !== undefined) ?
				observer.opt_scope :
				this;
			const args = (opt_args !== undefined) ?
				[].concat(opt_args) :
				[];
			observer.handler.apply(scope, args);
		});
	}
};

module.exports = EventEmitter;
