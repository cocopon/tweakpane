import {forceCast} from '../misc/type-util';
import {InputBindingController} from '../plugin/blade/common/controller/input-binding';
import {InputBindingEvents} from '../plugin/common/binding/input';
import {Emitter} from '../plugin/common/model/emitter';
import {BladeApi} from './blade-api';
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
	public readonly controller: InputBindingController<In>;
	private readonly emitter_: Emitter<InputBindingApiEvents<Ex>>;

	/**
	 * @hidden
	 */
	constructor(bindingController: InputBindingController<In>) {
		this.onBindingChange_ = this.onBindingChange_.bind(this);

		this.emitter_ = new Emitter();

		this.controller = bindingController;
		this.controller.binding.emitter.on('change', this.onBindingChange_);
	}

	get hidden(): boolean {
		return this.controller.blade.hidden;
	}

	set hidden(hidden: boolean) {
		this.controller.blade.hidden = hidden;
	}

	public dispose(): void {
		this.controller.blade.dispose();
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
		this.controller.binding.read();
	}

	private onBindingChange_(ev: InputBindingEvents<In>['change']) {
		const value = ev.sender.target.read();
		this.emitter_.emit('change', {
			event: new TpChangeEvent(
				this,
				forceCast(value),
				this.controller.binding.target.presetKey,
			),
		});
	}
}
