type Handler<E> = (ev: E) => void;

/**
 * @hidden
 */
interface Observer<E> {
	handler: Handler<E>;
	key: unknown;
}

/**
 * A type-safe event emitter.
 * @template E The interface that maps event names and event objects.
 */
export class Emitter<E> {
	private readonly observers_: {
		[EventName in keyof E]?: Observer<E[EventName]>[];
	};

	constructor() {
		this.observers_ = {};
	}

	/**
	 * Adds an event listener to the emitter.
	 * @param eventName The event name to listen.
	 * @param handler The event handler.
	 * @param opt_options The options.
	 * @param opt_options.key The key that can be used for removing the handler.
	 */
	public on<EventName extends keyof E>(
		eventName: EventName,
		handler: Handler<E[EventName]>,
		opt_options?: {
			key: unknown;
		},
	): Emitter<E> {
		let observers = this.observers_[eventName];
		if (!observers) {
			observers = this.observers_[eventName] = [];
		}

		observers.push({
			handler: handler,
			key: opt_options?.key ?? handler,
		});

		return this;
	}

	/**
	 * Removes an event listener from the emitter.
	 * @param eventName The event name.
	 * @param key The event handler to remove, or the key for removing the handler.
	 */
	public off<EventName extends keyof E>(
		eventName: EventName,
		key: Handler<E[EventName]> | unknown,
	): Emitter<E> {
		const observers = this.observers_[eventName];
		if (observers) {
			this.observers_[eventName] = observers.filter(
				(observer: Observer<E[EventName]>) => {
					return observer.key !== key;
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
