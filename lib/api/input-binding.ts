import {InputBindingController} from '../plugin/blade/common/controller/input-binding';
import {ComponentApi} from './component-api';
import {handleInputBinding} from './event-handler-adapters';

interface InputBindingApiEventHandlers<Ex> {
	change: (value: Ex) => void;
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

	/**
	 * @hidden
	 */
	constructor(bindingController: InputBindingController<In>) {
		this.controller = bindingController;
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

	public on<EventName extends keyof InputBindingApiEventHandlers<Ex>>(
		eventName: EventName,
		handler: InputBindingApiEventHandlers<Ex>[EventName],
	): InputBindingApi<In, Ex> {
		handleInputBinding({
			binding: this.controller.binding,
			eventName: eventName,
			handler: handler.bind(this),
		});
		return this;
	}

	public refresh(): void {
		this.controller.binding.read();
	}
}
