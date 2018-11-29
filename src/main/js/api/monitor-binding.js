// @flow

import MonitorBindingController from '../controller/monitor-binding';

type EventName = 'update';

export default class MonitorBindingApi<B: MonitorBindingController<*>> {
	+controller: B;

	constructor(bindingController: B) {
		this.controller = bindingController;
	}

	on(eventName: EventName, handler: Function): MonitorBindingApi<B> {
		const emitter = this.controller.binding.value.emitter;
		emitter.on(eventName, handler);
		return this;
	}

	refresh(): void {
		this.controller.binding.read();
	}
}
