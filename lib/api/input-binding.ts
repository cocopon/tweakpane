import {InputBindingController} from '../plugin/blade/common/controller/input-binding';
import {TpChangeEvent} from '../plugin/common/event/tp-event';
import {Emitter} from '../plugin/common/model/emitter';
import {ComponentApi} from './component-api';
import {adaptInputBinding} from './event-handler-adapters';

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
export class InputBindingApi<In, Ex> implements ComponentApi {
	/**
	 * @hidden
	 */
	public readonly controller: InputBindingController<In>;
	private readonly emitter_: Emitter<InputBindingApiEvents<Ex>>;

	/**
	 * @hidden
	 */
	constructor(bindingController: InputBindingController<In>) {
		this.controller = bindingController;

		this.emitter_ = new Emitter();
		adaptInputBinding<In, Ex>({
			binding: bindingController.binding,
			emitter: this.emitter_,
		});
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
}
