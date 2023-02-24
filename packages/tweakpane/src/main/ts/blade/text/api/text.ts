import {
	ApiChangeEvents,
	BladeApi,
	Emitter,
	Formatter,
	LabeledValueController,
	TextController,
	TpChangeEvent,
} from '@tweakpane/core';

export class TextBladeApi<T> extends BladeApi<
	LabeledValueController<T, TextController<T>>
> {
	private readonly emitter_: Emitter<ApiChangeEvents<T>> = new Emitter();

	/**
	 * @hidden
	 */
	constructor(controller: LabeledValueController<T, TextController<T>>) {
		super(controller);

		this.controller_.value.emitter.on('change', (ev) => {
			this.emitter_.emit('change', new TpChangeEvent(this, ev.rawValue));
		});
	}

	get label(): string | undefined {
		return this.controller_.props.get('label');
	}

	set label(label: string | undefined) {
		this.controller_.props.set('label', label);
	}

	get formatter(): Formatter<T> {
		return this.controller_.valueController.props.get('formatter');
	}

	set formatter(formatter: Formatter<T>) {
		this.controller_.valueController.props.set('formatter', formatter);
	}

	get value(): T {
		return this.controller_.value.rawValue;
	}

	set value(value: T) {
		this.controller_.value.rawValue = value;
	}

	public on<EventName extends keyof ApiChangeEvents<T>>(
		eventName: EventName,
		handler: (ev: ApiChangeEvents<T>[EventName]) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev);
		});
		return this;
	}
}
