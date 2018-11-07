// @flow

import MonitorBindingController from '../controller/monitor-binding';

type EventName = 'update';

export default class MonitorBindingApi<B: MonitorBindingController<*>> {
	controller_: B;

	constructor(bindingController: B) {
		this.controller_ = bindingController;
	}

	get controller(): B {
		return this.controller_;
	}

	on(eventName: EventName, handler: Function): MonitorBindingApi<B> {
		const emitter = this.controller_.binding.value.emitter;
		emitter.on(eventName, handler);
		return this;
	}

	refresh(): void {
		this.controller_.binding.read();
	}
}
