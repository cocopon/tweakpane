// @flow

import Emitter from '../misc/emitter';

type EventType = 'click';

export default class Button {
	+emitter: Emitter<EventType>;
	+title: string;

	constructor(title: string) {
		this.emitter = new Emitter();
		this.title = title;
	}

	click(): void {
		this.emitter.emit('click');
	}
}
