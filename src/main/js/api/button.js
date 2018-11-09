// @flow

import ButtonController from '../controller/button';

type EventName = 'click';

export default class ButtonApi {
	controller_: ButtonController;

	constructor(buttonController: ButtonController) {
		this.controller_ = buttonController;
	}

	get controller(): ButtonController {
		return this.controller_;
	}

	on(eventName: EventName, handler: Function) {
		const emitter = this.controller_.button.emitter;
		emitter.on(eventName, handler);
	}
}
