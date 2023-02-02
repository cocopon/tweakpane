import {BindingValue} from '../../../common/binding/value/binding';
import {ValueController} from '../../../common/controller/value';
import {Emitter} from '../../../common/model/emitter';
import {ValueEvents} from '../../../common/model/value';
import {forceCast} from '../../../misc/type-util';
import {BladeApi} from '../../common/api/blade';
import {TpChangeEvent} from '../../common/api/tp-event';
import {LabeledValueController} from '../../label/controller/value-label';

export interface BindingApiEvents<Ex> {
	change: {
		event: TpChangeEvent<Ex>;
	};
}

/**
 * The API for binding between the parameter and the pane.
 * @template In The internal type.
 * @template Ex The external type.
 */
export class BindingApi<
	In,
	Ex,
	C extends LabeledValueController<In, ValueController<In>, BindingValue<In>>,
> extends BladeApi<C> {
	private readonly emitter_: Emitter<BindingApiEvents<Ex>>;

	/**
	 * @hidden
	 */
	constructor(controller: C) {
		super(controller);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.emitter_ = new Emitter();

		this.controller_.value.emitter.on('change', this.onValueChange_);
	}

	get label(): string | undefined {
		return this.controller_.props.get('label');
	}

	set label(label: string | undefined) {
		this.controller_.props.set('label', label);
	}

	public on<EventName extends keyof BindingApiEvents<Ex>>(
		eventName: EventName,
		handler: (ev: BindingApiEvents<Ex>[EventName]['event']) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}

	public refresh(): void {
		this.controller_.value.fetch();
	}

	private onValueChange_(ev: ValueEvents<In>['change']) {
		const value = this.controller_.value;
		this.emitter_.emit('change', {
			event: new TpChangeEvent(
				this,
				forceCast(value.binding.target.read()),
				value.binding.target.presetKey,
				ev.options.last,
			),
		});
	}
}
