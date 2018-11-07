// @flow

import InputBindingController from '../controller/input-binding';

type EventName = 'change';

export default class InputBindingApi<B: InputBindingController<*, *>> {
	controller_: B;

	constructor(bindingController: B) {
		this.controller_ = bindingController;
	}

	get controller(): B {
		return this.controller_;
	}

	on(eventName: EventName, handler: Function): InputBindingApi<B> {
		const emitter = this.controller_.binding.value.emitter;
		emitter.on(eventName, handler);
		return this;
	}

	refresh(): void {
		this.controller_.binding.read();
	}
}
