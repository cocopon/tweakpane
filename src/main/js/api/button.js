// @flow

import ButtonController from '../controller/button';

type EventName = 'click';

export default class ButtonApi {
	+controller: ButtonController;

	constructor(buttonController: ButtonController) {
		this.controller = buttonController;
	}

	on(eventName: EventName, handler: Function) {
		const emitter = this.controller.button.emitter;
		emitter.on(eventName, handler);
	}
}
