// @flow

import Emitter from '../misc/emitter';

type EventType = 'change';

export default class GraphCursor {
	emitter_: Emitter<EventType>;
	index_: number;

	constructor() {
		this.emitter_ = new Emitter();
		this.index_ = -1;
	}

	get emitter(): Emitter<EventType> {
		return this.emitter_;
	}

	get index(): number {
		return this.index_;
	}

	set index(index: number): void {
		const changed = (this.index_ !== index);
		if (changed) {
			this.index_ = index;
			this.emitter_.emit('change', [index]);
		}
	}
}
