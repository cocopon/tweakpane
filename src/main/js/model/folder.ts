import {Emitter, EventTypeMap} from '../misc/emitter';

/**
 * @hidden
 */
export interface FolderEvents extends EventTypeMap {
	change: {
		expanded: boolean;
		sender: Folder;
	};
}

/**
 * @hidden
 */
export class Folder {
	public readonly emitter: Emitter<FolderEvents>;
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
			this.emitter.emit('change', {
				expanded: expanded,
				sender: this,
			});
		}
	}

	get expandedHeight(): number | null {
		return this.expandedHeight_;
	}

	set expandedHeight(expandedHeight: number | null) {
		const changed = this.expandedHeight_ !== expandedHeight;
		if (changed) {
			this.expandedHeight_ = expandedHeight;
			this.emitter.emit('change', {
				expanded: this.expanded_,
				sender: this,
			});
		}
	}
}
