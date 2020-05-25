type Handler<E> = (ev: E) => void;

interface Observer<E> {
	handler: Handler<E>;
}

/**
 * @hidden
 */
export interface EventTypeMap {
	[key: string]: {
		[key: string]: any;
	};
}

/**
 * @hidden
 */
export class Emitter<E extends EventTypeMap> {
	// Only for type inference
	public readonly typeMap: E;

	private observers_: {[EventName in keyof E]?: Observer<E[EventName]>[]};

	constructor() {
		this.observers_ = {};
	}

	public on<EventName extends keyof E>(
		eventName: EventName,
		handler: Handler<E[EventName]>,
	): Emitter<E> {
		let observers = this.observers_[eventName];
		if (!observers) {
			observers = this.observers_[eventName] = [];
		}

		observers.push({
			handler: handler,
		});

		return this;
	}

	public off<EventName extends keyof E>(
		eventName: EventName,
		handler: Handler<E[EventName]>,
	): Emitter<E> {
		const observers = this.observers_[eventName];
		if (observers) {
			this.observers_[eventName] = observers.filter(
				(observer: Observer<E[EventName]>) => {
					return observer.handler !== handler;
				},
			);
		}
		return this;
	}

	public emit<EventName extends keyof E>(
		eventName: EventName,
		event: E[EventName],
	): void {
		const observers = this.observers_[eventName];
		if (!observers) {
			return;
		}

		observers.forEach((observer) => {
			observer.handler(event);
		});
	}
}
