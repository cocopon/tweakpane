import MonitorBindingController from '../controller/monitor-binding';
import {Handler} from '../misc/emitter';

type EventName = 'update';

export default class MonitorBindingApi<In> {
	public readonly controller: MonitorBindingController<In>;

	constructor(bindingController: MonitorBindingController<In>) {
		this.controller = bindingController;
	}

	public on(eventName: EventName, handler: Handler): MonitorBindingApi<In> {
		const emitter = this.controller.binding.value.emitter;
		emitter.on(eventName, handler);
		return this;
	}

	public refresh(): void {
		this.controller.binding.read();
	}
}
