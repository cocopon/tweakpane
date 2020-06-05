import {InputBindingController} from '../controller/input-binding';
import * as HandlerAdapters from './event-handler-adapters';

interface InputBindingApiEventHandlers {
	change: (value: unknown) => void;
}

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

	get hidden(): boolean {
		return this.controller.viewModel.hidden;
	}

	set hidden(hidden: boolean) {
		this.controller.viewModel.hidden = hidden;
	}

	public on<EventName extends keyof InputBindingApiEventHandlers>(
		eventName: EventName,
		handler: InputBindingApiEventHandlers[EventName],
	): InputBindingApi<In, Out> {
		HandlerAdapters.input({
			binding: this.controller.binding,
			eventName: eventName,
			handler: handler,
		});
		return this;
	}

	public refresh(): void {
		this.controller.binding.read();
	}
}
