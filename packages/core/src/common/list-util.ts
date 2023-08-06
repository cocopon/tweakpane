import {forceCast, isEmpty} from '../misc/type-util.js';
import {ListConstraint, ListItem} from './constraint/list.js';
import {MicroParser, MicroParsers, parseRecord} from './micro-parsers.js';
import {
	ArrayStyleListOptions,
	ListParamsOptions,
	ObjectStyleListOptions,
} from './params.js';

export function parseListOptions<T>(
	value: unknown,
): ListParamsOptions<T> | undefined {
	const p = MicroParsers;
	if (Array.isArray(value)) {
		return parseRecord({items: value}, (p) => ({
			items: p.required.array(
				p.required.object({
					text: p.required.string,
					value: p.required.raw as MicroParser<T>,
				}),
			),
		}))?.items;
	}
	if (typeof value === 'object') {
		return (p.required.raw as MicroParser<ObjectStyleListOptions<T>>)(value)
			.value;
	}
	return undefined;
}

export function normalizeListOptions<T>(
	options: ArrayStyleListOptions<T> | ObjectStyleListOptions<T>,
): ListItem<T>[] {
	if (Array.isArray(options)) {
		return options;
	}

	const items: ListItem<T>[] = [];
	Object.keys(options).forEach((text) => {
		items.push({text: text, value: options[text]});
	});
	return items;
}

/**
 * Tries to create a list constraint.
 * @template T The type of the raw value.
 * @param options The list options.
 * @return A constraint or null if not found.
 */
export function createListConstraint<T>(
	options: ListParamsOptions<T> | undefined,
): ListConstraint<T> | null {
	return !isEmpty(options)
		? new ListConstraint(normalizeListOptions<T>(forceCast(options)))
		: null;
}
