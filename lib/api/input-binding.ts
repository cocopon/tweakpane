import {forceCast} from '../misc/type-util';
import {InputBindingController} from '../plugin/common/controller/input-binding';
import {ComponentApi} from './component-api';
import {handleInputBinding} from './event-handler-adapters';

interface InputBindingApiEventHandlers<Ex> {
	change: (value: Ex) => void;
}

/**
 * The API for the input binding between the parameter and the pane.
 * @param In The type internal Tweakpane.
 * @param Ex The type external Tweakpane (= parameter object).
 */
export class InputBindingApi<In, Ex> implements ComponentApi {
	/**
	 * @hidden
	 */
	public readonly controller: InputBindingController<In, Ex>;

	/**
	 * @hidden
	 */
	constructor(bindingController: InputBindingController<In, Ex>) {
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
			// TODO: Type-safe
			handler: forceCast(handler.bind(this)),
		});
		return this;
	}

	public refresh(): void {
		this.controller.binding.read();
	}
}
