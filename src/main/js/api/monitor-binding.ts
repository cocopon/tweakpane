import MonitorBindingController from '../controller/monitor-binding';
import {Handler} from '../misc/emitter';

type EventName = 'update';

/**
 * The API for the monitor binding between the parameter and the pane.
 */
export default class MonitorBindingApi<In> {
	/**
	 * @hidden
	 */
	public readonly controller: MonitorBindingController<In>;

	/**
	 * @hidden
	 */
	constructor(bindingController: MonitorBindingController<In>) {
		this.controller = bindingController;
	}

	public dispose(): void {
		this.controller.dispose();
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
