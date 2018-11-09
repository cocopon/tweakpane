// @flow

import Emitter from '../misc/emitter';

type EventType = 'append';

export default class List<T> {
	emitter_: Emitter<EventType>;
	items_: T[];

	constructor() {
		this.emitter_ = new Emitter();
		this.items_ = [];
	}

	get emitter(): Emitter<EventType> {
		return this.emitter_;
	}

	get items(): T[] {
		return this.items_;
	}

	append(item: T): void {
		this.items_.push(item);
		this.emitter_.emit('append', [item]);
	}
}
