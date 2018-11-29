// @flow

import Emitter from '../misc/emitter';

type EventType = 'change';

export default class Folder {
	+emitter: Emitter<EventType>;
	+title: string;
	expandedHeight_: ?number;
	expanded_: boolean;

	constructor(title: string, expanded: boolean) {
		this.emitter = new Emitter();
		this.expanded_ = expanded;
		this.expandedHeight_ = null;
		this.title = title;
	}

	get expanded(): boolean {
		return this.expanded_;
	}

	set expanded(expanded: boolean): void {
		const changed = (this.expanded_ !== expanded);
		if (changed) {
			this.expanded_ = expanded;
			this.emitter.emit('change');
		}
	}

	get expandedHeight(): ?number {
		return this.expandedHeight_;
	}

	set expandedHeight(expandedHeight: ?number): void {
		const changed = (this.expandedHeight_ !== expandedHeight);
		if (changed) {
			this.expandedHeight_ = expandedHeight;
			this.emitter.emit('change');
		}
	}
}
