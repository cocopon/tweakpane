// @flow

import type {Constraint} from './constraint';

export type ListItem<T> = {
	text: string,
	value: T,
};

type Config<T> = {
	options: ListItem<T>[],
};

export default class ListConstraint<T> implements Constraint<T> {
	opts_: ListItem<T>[];

	constructor(config: Config<T>) {
		this.opts_ = config.options;
	}

	get options(): ListItem<T>[] {
		return this.opts_;
	}

	constrain(value: T): T {
		const opts = this.opts_;

		if (opts.length === 0) {
			return value;
		}

		const matched = (opts.filter((item) => {
			return item.value === value;
		}).length > 0);

		return matched ?
			value :
			opts[0].value;
	}
}
