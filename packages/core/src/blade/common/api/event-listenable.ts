export interface EventListenable<E> {
	off<EventName extends keyof E>(
		eventName: EventName,
		handler: (ev: E[EventName]) => void,
	): this;
	on<EventName extends keyof E>(
		eventName: EventName,
		handler: (ev: E[EventName]) => void,
	): this;
}
