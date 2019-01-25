export type Handler = (...args: any[]) => void;

interface Observer {
	handler: Handler;
}

/**
 * @hidden
 */
export default class Emitter<EventType extends string> {
	private observers_: {[eventName in EventType]?: Observer[]};

	constructor() {
		this.observers_ = {};
	}

	public on(eventName: EventType, handler: Handler): Emitter<EventType> {
		let observers = this.observers_[eventName];
		if (!observers) {
			observers = this.observers_[eventName] = [];
		}

		observers.push({
			handler: handler,
		});

		return this;
	}

	public off(eventName: EventType, handler: Handler): Emitter<EventType> {
		const observers = this.observers_[eventName];
		if (observers) {
			this.observers_[eventName] = observers.filter((observer: Observer) => {
				return observer.handler !== handler;
			});
		}
		return this;
	}

	public emit(eventName: EventType, opt_args?: any[]): void {
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
