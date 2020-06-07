import {MonitorBindingController} from '../controller/monitor-binding';
import {ComponentApi} from './component-api';
import * as EventHandlerAdapters from './event-handler-adapters';

interface MonitorBindingApiEventHandlers {
	update: (value: unknown) => void;
}

/**
 * The API for the monitor binding between the parameter and the pane.
 */
export class MonitorBindingApi<In> implements ComponentApi {
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

	get hidden(): boolean {
		return this.controller.viewModel.hidden;
	}

	set hidden(hidden: boolean) {
		this.controller.viewModel.hidden = hidden;
	}

	public dispose(): void {
		this.controller.controller.viewModel.dispose();
	}

	public on<EventName extends keyof MonitorBindingApiEventHandlers>(
		eventName: EventName,
		handler: MonitorBindingApiEventHandlers[EventName],
	): MonitorBindingApi<In> {
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
