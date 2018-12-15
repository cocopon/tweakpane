// @flow

import Emitter from '../misc/emitter';

type EventType = 'change';

export default class Foldable {
	+emitter: Emitter<EventType>;
	expanded_: boolean;

	constructor() {
		this.emitter = new Emitter();
		this.expanded_ = false;
	}

	get expanded(): boolean {
		return this.expanded_;
	}

	set expanded(expanded: boolean): void {
		const changed = this.expanded_ !== expanded;
		if (changed) {
			this.expanded_ = expanded;
			this.emitter.emit('change');
		}
	}
}
