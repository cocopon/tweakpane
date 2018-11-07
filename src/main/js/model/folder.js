// @flow

import Emitter from '../misc/emitter';

type EventType = 'change';

export default class Folder {
	emitter_: Emitter<EventType>;
	expanded_: boolean;
	expandedHeight_: ?number;
	title_: string;

	constructor(title: string, expanded: boolean) {
		this.emitter_ = new Emitter();
		this.expanded_ = expanded;
		this.expandedHeight_ = null;
		this.title_ = title;
	}

	get emitter(): Emitter<EventType> {
		return this.emitter_;
	}

	get title(): string {
		return this.title_;
	}

	get expanded(): boolean {
		return this.expanded_;
	}

	set expanded(expanded: boolean): void {
		const changed = (this.expanded_ !== expanded);
		if (changed) {
			this.expanded_ = expanded;
			this.emitter_.emit('change');
		}
	}

	get expandedHeight(): ?number {
		return this.expandedHeight_;
	}

	set expandedHeight(expandedHeight: ?number): void {
		const changed = (this.expandedHeight_ !== expandedHeight);
		if (changed) {
			this.expandedHeight_ = expandedHeight;
			this.emitter_.emit('change');
		}
	}
}
