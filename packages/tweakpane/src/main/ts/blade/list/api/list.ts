import {
	ApiChangeEvents,
	BladeApi,
	Emitter,
	LabeledValueController,
	ListController,
	ListItem,
	TpChangeEvent,
} from '@tweakpane/core';

export class ListBladeApi<T> extends BladeApi<
	LabeledValueController<T, ListController<T>>
> {
	private readonly emitter_: Emitter<ApiChangeEvents<T>> = new Emitter();

	/**
	 * @hidden
	 */
	constructor(controller: LabeledValueController<T, ListController<T>>) {
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

	get options(): ListItem<T>[] {
		return this.controller_.valueController.props.get('options');
	}

	set options(options: ListItem<T>[]) {
		this.controller_.valueController.props.set('options', options);
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
