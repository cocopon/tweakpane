import {
	ApiChangeEvents,
	BladeApi,
	Emitter,
	LabeledValueController,
	SliderTextController,
	TpChangeEvent,
} from '@tweakpane/core';

export class SliderBladeApi extends BladeApi<
	LabeledValueController<number, SliderTextController>
> {
	private readonly emitter_: Emitter<ApiChangeEvents<number>> = new Emitter();

	constructor(
		controller: LabeledValueController<number, SliderTextController>,
	) {
		super(controller);

		this.controller_.value.emitter.on('change', (ev) => {
			this.emitter_.emit('change', {
				event: new TpChangeEvent(this, ev.rawValue),
			});
		});
	}

	get label(): string | undefined {
		return this.controller_.props.get('label');
	}

	set label(label: string | undefined) {
		this.controller_.props.set('label', label);
	}

	get maxValue(): number {
		return this.controller_.valueController.sliderController.props.get(
			'maxValue',
		);
	}

	set maxValue(maxValue: number) {
		this.controller_.valueController.sliderController.props.set(
			'maxValue',
			maxValue,
		);
	}

	get minValue(): number {
		return this.controller_.valueController.sliderController.props.get(
			'minValue',
		);
	}

	set minValue(minValue: number) {
		this.controller_.valueController.sliderController.props.set(
			'minValue',
			minValue,
		);
	}

	get value(): number {
		return this.controller_.value.rawValue;
	}

	set value(value: number) {
		this.controller_.value.rawValue = value;
	}

	public on<EventName extends keyof ApiChangeEvents<number>>(
		eventName: EventName,
		handler: (ev: ApiChangeEvents<number>[EventName]['event']) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}
}
