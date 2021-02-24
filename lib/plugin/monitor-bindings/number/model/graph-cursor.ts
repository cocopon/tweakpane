import {Emitter} from '../../../common/model/emitter';

/**
 * @hidden
 */
export interface GraphCursorEvents {
	change: {
		index: number;
		sender: GraphCursor;
	};
}

/**
 * @hidden
 */
export class GraphCursor {
	public readonly emitter: Emitter<GraphCursorEvents>;
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
			this.emitter.emit('change', {
				index: index,
				sender: this,
			});
		}
	}
}
