import {ValueMap} from '../model/value-map.js';
import {Constraint} from './constraint.js';

export interface ListItem<T> {
	text: string;
	value: T;
}

/**
 * A list constranit.
 * @template T The type of the value.
 */
export class ListConstraint<T> implements Constraint<T> {
	public readonly values: ValueMap<{
		options: ListItem<T>[];
	}>;

	constructor(options: ListItem<T>[]) {
		this.values = ValueMap.fromObject({
			options: options,
		});
	}

	public constrain(value: T): T {
		const opts = this.values.get('options');

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
