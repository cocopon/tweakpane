// @flow

type Observer = {
	handler: Function,
};

export default class Emitter<EventType> {
	observers_: {[eventName: EventType]: Observer[]};

	constructor() {
		this.observers_ = {};
	}

	on(eventName: EventType, handler: Function): Emitter<EventType> {
		let observers = this.observers_[eventName];
		if (!observers) {
			observers = this.observers_[eventName] = [];
		}

		observers.push({
			handler,
		});

		return this;
	}

	off(eventName: EventType, handler: Function): Emitter<EventType> {
		this.observers_[eventName] = this.observers_[eventName].filter(
			(observer) => {
				return observer.handler !== handler;
			},
		);

		return this;
	}

	emit(eventName: EventType, opt_args?: mixed[]): void {
		const observers = this.observers_[eventName];
		if (!observers) {
			return;
		}

		observers.forEach((observer) => {
			const handlerArgs = opt_args || [];
			observer.handler(...handlerArgs);
		});
	}
}
