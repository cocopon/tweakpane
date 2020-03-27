import {MonitorBindingController} from '../controller/monitor-binding';
import {Handler} from '../misc/emitter';
import * as EventHandlerAdapters from './event-handler-adapters';

type EventName = 'update';

/**
 * The API for the monitor binding between the parameter and the pane.
 */
export class MonitorBindingApi<In> {
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
		this.controller.controller.disposable.dispose();
	}

	public on(eventName: EventName, handler: Handler): MonitorBindingApi<In> {
		EventHandlerAdapters.monitor({
			binding: this.controller.binding,
			eventName: eventName,
			handler: handler,
		});
		return this;
	}

	public refresh(): void {
		this.controller.binding.read();
	}
}
