import {InputBindingEvents} from '../../../common/binding/input';
import {Emitter} from '../../../common/model/emitter';
import {forceCast} from '../../../misc/type-util';
import {InputBindingController} from '../controller/input-binding';
import {BladeApi} from './blade';
import {TpChangeEvent} from './tp-event';

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
export class InputBindingApi<In, Ex> implements BladeApi {
	/**
	 * @hidden
	 */
	public readonly controller_: InputBindingController<In>;
	private readonly emitter_: Emitter<InputBindingApiEvents<Ex>>;

	/**
	 * @hidden
	 */
	constructor(bindingController: InputBindingController<In>) {
		this.onBindingChange_ = this.onBindingChange_.bind(this);

		this.emitter_ = new Emitter();

		this.controller_ = bindingController;
		this.controller_.binding.emitter.on('change', this.onBindingChange_);
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

	public dispose(): void {
		this.controller_.blade.dispose();
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
			),
		});
	}
}
