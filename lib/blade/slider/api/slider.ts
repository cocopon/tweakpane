import {Emitter} from '../../../common/model/emitter';
import {SliderTextController} from '../../../common/number/controller/slider-text';
import {BladeApi, LabelableApi} from '../../common/api/blade';
import {TpChangeEvent} from '../../common/api/tp-event';
import {ApiChangeEvents} from '../../common/api/types';
import {LabeledController} from '../../labeled/controller/labeled';

export class SliderBladeApi implements BladeApi, LabelableApi {
	private readonly emitter_: Emitter<ApiChangeEvents<number>> = new Emitter();

	constructor(
		public readonly controller_: LabeledController<SliderTextController>,
	) {
		this.controller_.valueController.value.emitter.on('change', (ev) => {
			this.emitter_.emit('change', {
				event: new TpChangeEvent(this, ev.rawValue),
			});
		});
	}

	get disabled(): boolean {
		return this.controller_.viewProps.get('disabled');
	}

	set disabled(disabled: boolean) {
		this.controller_.viewProps.set('disabled', disabled);
	}

	get hidden(): boolean {
		return this.controller_.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller_.viewProps.set('hidden', hidden);
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
		return this.controller_.valueController.value.rawValue;
	}

	set value(value: number) {
		this.controller_.valueController.value.rawValue = value;
	}

	public dispose(): void {
		this.controller_.blade.dispose();
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
