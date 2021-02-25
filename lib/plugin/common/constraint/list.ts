import {Constraint} from './constraint';

/**
 * @hidden
 */
export interface ListItem<T> {
	text: string;
	value: T;
}

interface Config<T> {
	options: ListItem<T>[];
}

/**
 * A list constranit.
 * @template T The type of the value.
 */
export class ListConstraint<T> implements Constraint<T> {
	private opts_: ListItem<T>[];

	constructor(config: Config<T>) {
		this.opts_ = config.options;
	}

	get options(): ListItem<T>[] {
		return this.opts_;
	}

	public constrain(value: T): T {
		const opts = this.opts_;

		if (opts.length === 0) {
			return value;
		}

		const matched =
			opts.filter((item) => {
				return item.value === value;
			}).length > 0;

		return matched ? value : opts[0].value;
	}
}
