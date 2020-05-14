import {InputBindingController} from '../controller/input-binding';
import {Handler} from '../misc/emitter';

type EventName = 'change';

/**
 * The API for the input binding between the parameter and the pane.
 * @param In The type inner Tweakpane.
 * @param Out The type outer Tweakpane (= parameter object).
 */
export class InputBindingApi<In, Out> {
	/**
	 * @hidden
	 */
	public readonly controller: InputBindingController<In, Out>;

	/**
	 * @hidden
	 */
	constructor(bindingController: InputBindingController<In, Out>) {
		this.controller = bindingController;
	}

	public on(eventName: EventName, handler: Handler): InputBindingApi<In, Out> {
		const emitter = this.controller.binding.value.emitter;
		emitter.on(eventName, handler);
		return this;
	}

	public refresh(): void {
		this.controller.binding.read();
	}
}
