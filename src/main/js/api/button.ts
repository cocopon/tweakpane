import {ButtonController} from '../controller/button';

interface ButtonApiEventHandlers {
	click: () => void;
}

export class ButtonApi {
	/**
	 * @hidden
	 */
	public readonly controller: ButtonController;

	/**
	 * @hidden
	 */
	constructor(buttonController: ButtonController) {
		this.controller = buttonController;
	}

	public dispose(): void {
		this.controller.disposable.dispose();
	}

	public on<EventName extends keyof ButtonApiEventHandlers>(
		eventName: EventName,
		handler: ButtonApiEventHandlers[EventName],
	): ButtonApi {
		const emitter = this.controller.button.emitter;
		emitter.on(eventName, handler);
		return this;
	}
}
