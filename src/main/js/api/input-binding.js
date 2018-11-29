// @flow

import InputBindingController from '../controller/input-binding';

type EventName = 'change';

export default class InputBindingApi<B: InputBindingController<*, *>> {
	+controller: B;

	constructor(bindingController: B) {
		this.controller = bindingController;
	}

	on(eventName: EventName, handler: Function): InputBindingApi<B> {
		const emitter = this.controller.binding.value.emitter;
		emitter.on(eventName, handler);
		return this;
	}

	refresh(): void {
		this.controller.binding.read();
	}
}
