import {InputBindingEvents} from '../../../common/binding/input';
import {Emitter} from '../../../common/model/emitter';
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

		this.onBindingChange_ = this.onBindingChange_.bind(this);

		this.emitter_ = new Emitter();

		this.controller_.binding.emitter.on('change', this.onBindingChange_);
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
		this.controller_.binding.read();
	}

	private onBindingChange_(ev: InputBindingEvents<In>['change']) {
		const value = ev.sender.target.read();
		this.emitter_.emit('change', {
			event: new TpChangeEvent(
				this,
				forceCast(value),
				this.controller_.binding.target.presetKey,
				ev.options.last,
			),
		});
	}
}
