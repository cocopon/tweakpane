// @flow

import Emitter from '../misc/emitter';

type EventType = 'append';

export default class List<T> {
	public readonly emitter: Emitter<EventType>;
	private items_: T[];

	constructor() {
		this.emitter = new Emitter();
		this.items_ = [];
	}

	get items(): T[] {
		return this.items_;
	}

	public append(item: T): void {
		this.items_.push(item);
		this.emitter.emit('append', [item]);
	}
}
