import ButtonController from '../controller/button';
import {Handler} from '../misc/emitter';

type EventName = 'click';

export default class ButtonApi {
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

	public on(eventName: EventName, handler: Handler) {
		const emitter = this.controller.button.emitter;
		emitter.on(eventName, handler);
	}
}
