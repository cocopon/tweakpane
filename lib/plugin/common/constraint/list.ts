import {Constraint} from './constraint';

/**
 * @hidden
 */
export interface ListItem<T> {
	text: string;
	value: T;
}

/**
 * A list constranit.
 * @template T The type of the value.
 */
export class ListConstraint<T> implements Constraint<T> {
	public readonly options: ListItem<T>[];

	constructor(options: ListItem<T>[]) {
		this.options = options;
	}

	public constrain(value: T): T {
		const opts = this.options;

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
