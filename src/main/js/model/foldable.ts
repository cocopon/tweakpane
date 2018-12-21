// @flow

import Emitter from '../misc/emitter';

type EventType = 'change';

export default class Foldable {
	public readonly emitter: Emitter<EventType>;
	private expanded_: boolean;

	constructor() {
		this.emitter = new Emitter();
		this.expanded_ = false;
	}

	get expanded(): boolean {
		return this.expanded_;
	}

	set expanded(expanded: boolean) {
		const changed = this.expanded_ !== expanded;
		if (changed) {
			this.expanded_ = expanded;
			this.emitter.emit('change');
		}
	}
}
