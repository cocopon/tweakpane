import InputBindingController from '../controller/input-binding';
import {Handler} from '../misc/emitter';

type EventName = 'change';

export default class InputBindingApi<In, Out> {
	public readonly controller: InputBindingController<In, Out>;

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
