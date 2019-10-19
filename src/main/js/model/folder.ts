import {Emitter} from '../misc/emitter';

type EventType = 'change';

/**
 * @hidden
 */
export class Folder {
	public readonly emitter: Emitter<EventType>;
	public readonly title: string;
	private expandedHeight_: number | null;
	private expanded_: boolean;

	constructor(title: string, expanded: boolean) {
		this.emitter = new Emitter();
		this.expanded_ = expanded;
		this.expandedHeight_ = null;
		this.title = title;
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

	get expandedHeight(): number | null {
		return this.expandedHeight_;
	}

	set expandedHeight(expandedHeight: number | null) {
		const changed = this.expandedHeight_ !== expandedHeight;
		if (changed) {
			this.expandedHeight_ = expandedHeight;
			this.emitter.emit('change');
		}
	}
}
