import InputBindingController from '../controller/input-binding';
import {Handler} from '../misc/emitter';

type EventName = 'change';

export default class InputBindingApi<
	In,
	Out,
	B extends InputBindingController<In, Out>
> {
	public readonly controller: B;

	constructor(bindingController: B) {
		this.controller = bindingController;
	}

	public on(
		eventName: EventName,
		handler: Handler,
	): InputBindingApi<In, Out, B> {
		const emitter = this.controller.binding.value.emitter;
		emitter.on(eventName, handler);
		return this;
	}

	public refresh(): void {
		this.controller.binding.read();
	}
}
