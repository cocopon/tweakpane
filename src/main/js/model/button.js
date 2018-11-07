// @flow

import Emitter from '../misc/emitter';

type EventType = 'click';

export default class Button {
	emitter_: Emitter<EventType>;
	title_: string;

	constructor(title: string) {
		this.emitter_ = new Emitter();
		this.title_ = title;
	}

	get emitter(): Emitter<*> {
		return this.emitter_;
	}

	get title(): string {
		return this.title_;
	}

	click(): void {
		this.emitter_.emit('click');
	}
}
