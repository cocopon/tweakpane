import Emitter from '../misc/emitter';

type EventType = 'change';

export default class GraphCursor {
	public readonly emitter: Emitter<EventType>;
	private index_: number;

	constructor() {
		this.emitter = new Emitter();
		this.index_ = -1;
	}

	get index(): number {
		return this.index_;
	}

	set index(index: number) {
		const changed = this.index_ !== index;
		if (changed) {
			this.index_ = index;
			this.emitter.emit('change', [index]);
		}
	}
}
