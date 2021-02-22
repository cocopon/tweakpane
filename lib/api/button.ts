import {forceCast} from '../misc/type-util';
import {ButtonController} from '../plugin/general/button/controller';
import {ComponentApi} from './component-api';

interface ButtonApiEventHandlers {
	click: () => void;
}

export class ButtonApi implements ComponentApi {
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

	get hidden(): boolean {
		return this.controller.blade.hidden;
	}

	set hidden(hidden: boolean) {
		this.controller.blade.hidden = hidden;
	}

	public dispose(): void {
		this.controller.blade.dispose();
	}

	public on<EventName extends keyof ButtonApiEventHandlers>(
		eventName: EventName,
		handler: ButtonApiEventHandlers[EventName],
	): ButtonApi {
		const emitter = this.controller.button.emitter;
		// TODO: Type-safe
		emitter.on(eventName, forceCast(handler.bind(this)));
		return this;
	}
}
