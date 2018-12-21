// @flow

import MonitorBindingController from '../controller/monitor-binding';
import {Handler} from '../misc/emitter';

type EventName = 'update';

export default class MonitorBindingApi<
	In,
	B extends MonitorBindingController<In>
> {
	public readonly controller: B;

	constructor(bindingController: B) {
		this.controller = bindingController;
	}

	public on(eventName: EventName, handler: Handler): MonitorBindingApi<In, B> {
		const emitter = this.controller.binding.value.emitter;
		emitter.on(eventName, handler);
		return this;
	}

	public refresh(): void {
		this.controller.binding.read();
	}
}
