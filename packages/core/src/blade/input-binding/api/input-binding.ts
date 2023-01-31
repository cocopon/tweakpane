import {BindingValue} from '../../../common/model/binding-value';
import {Emitter} from '../../../common/model/emitter';
import {ValueEvents} from '../../../common/model/value';
import {TpError} from '../../../common/tp-error';
import {forceCast} from '../../../misc/type-util';
import {BladeApi} from '../../common/api/blade';
import {TpChangeEvent} from '../../common/api/tp-event';
import {InputBindingController} from '../controller/input-binding';

export interface InputBindingApiEvents<Ex> {
	change: {
		event: TpChangeEvent<Ex>;
	};
}

/**
 * The API for the input binding between the parameter and the pane.
 * @template In The internal type.
 * @template Ex The external type (= parameter object).
 */
export class InputBindingApi<In, Ex> extends BladeApi<
	InputBindingController<In>
> {
	private readonly emitter_: Emitter<InputBindingApiEvents<Ex>>;

	/**
	 * @hidden
	 */
	constructor(controller: InputBindingController<In>) {
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

	public on<EventName extends keyof InputBindingApiEvents<Ex>>(
		eventName: EventName,
		handler: (ev: InputBindingApiEvents<Ex>[EventName]['event']) => void,
	): InputBindingApi<In, Ex> {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}

	public refresh(): void {
		const value = this.controller_.value;
		if (!(value instanceof BindingValue)) {
			throw TpError.shouldNeverHappen();
		}
		value.read();
	}

	private onValueChange_(ev: ValueEvents<In>['change']) {
		const binding = this.controller_.value.binding;
		const value = binding.target.read();
		this.emitter_.emit('change', {
			event: new TpChangeEvent(
				this,
				forceCast(value),
				binding.target.presetKey,
				ev.options.last,
			),
		});
	}
}
