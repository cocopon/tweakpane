import {
	ApiChangeEvents,
	BladeApi,
	Emitter,
	EventListenable,
	Formatter,
	LabeledValueBladeController,
	TextController,
	TpChangeEvent,
} from '@tweakpane/core';

export class TextBladeApi<T>
	extends BladeApi<LabeledValueBladeController<T, TextController<T>>>
	implements EventListenable<ApiChangeEvents<T>>
{
	private readonly emitter_: Emitter<ApiChangeEvents<T>> = new Emitter();

	/**
	 * @hidden
	 */
	constructor(controller: LabeledValueBladeController<T, TextController<T>>) {
		super(controller);

		this.controller.value.emitter.on('change', (ev) => {
			this.emitter_.emit('change', new TpChangeEvent(this, ev.rawValue));
		});
	}

	get label(): string | null | undefined {
		return this.controller.labelController.props.get('label');
	}

	set label(label: string | null | undefined) {
		this.controller.labelController.props.set('label', label);
	}

	get formatter(): Formatter<T> {
		return this.controller.valueController.props.get('formatter');
	}

	set formatter(formatter: Formatter<T>) {
		this.controller.valueController.props.set('formatter', formatter);
	}

	get value(): T {
		return this.controller.value.rawValue;
	}

	set value(value: T) {
		this.controller.value.rawValue = value;
	}

	public on<EventName extends keyof ApiChangeEvents<T>>(
		eventName: EventName,
		handler: (ev: ApiChangeEvents<T>[EventName]) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(
			eventName,
			(ev) => {
				bh(ev);
			},
			{
				key: handler,
			},
		);
		return this;
	}

	public off<EventName extends keyof ApiChangeEvents<T>>(
		eventName: EventName,
		handler: (ev: ApiChangeEvents<T>[EventName]) => void,
	): this {
		this.emitter_.off(eventName, handler);
		return this;
	}
}
