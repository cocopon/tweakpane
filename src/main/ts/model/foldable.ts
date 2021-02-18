import {Emitter} from '../misc/emitter';

/**
 * @hidden
 */
export interface FoldableEvents {
	change: {
		sender: Foldable;
	};
}

/**
 * @hidden
 */
export class Foldable {
	public readonly emitter: Emitter<FoldableEvents>;
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
			this.emitter.emit('change', {
				sender: this,
			});
		}
	}
}
