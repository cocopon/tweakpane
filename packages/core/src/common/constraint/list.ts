import {ValueMap} from '../model/value-map';
import {Constraint} from './constraint';

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

	// TODO: Remove property in the next major version
	/**
	 * @deprecated Use values.get('options') instead.
	 */
	get options(): ListItem<T>[] {
		return this.values.get('options');
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
