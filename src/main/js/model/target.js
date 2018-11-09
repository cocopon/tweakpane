// @flow

import FlowUtil from '../misc/flow-util';

export default class Target {
	key_: string;
	obj_: Object;
	presetKey_: string;

	constructor(object: Object, key: string, opt_id?: string) {
		this.obj_ = object;
		this.key_ = key;
		this.presetKey_ = FlowUtil.getOrDefault(opt_id, key);
	}

	get key(): string {
		return this.key_;
	}

	get presetKey(): string {
		return this.presetKey_;
	}

	read(): mixed {
		return this.obj_[this.key_];
	}

	write(value: mixed): void {
		this.obj_[this.key_] = value;
	}
}
