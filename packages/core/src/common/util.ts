import {forceCast, isEmpty} from '../misc/type-util';
import {findConstraint} from './constraint/composite';
import {Constraint} from './constraint/constraint';
import {ListConstraint, ListItem} from './constraint/list';
import {StepConstraint} from './constraint/step';
import {getDecimalDigits} from './number-util';
import {
	ArrayStyleListOptions,
	ListParamsOptions,
	ObjectStyleListOptions,
	PickerLayout,
	PointDimensionParams,
} from './params';
import {ParamsParser, ParamsParsers} from './params-parsers';

export function parseListOptions<T>(
	value: unknown,
): ListParamsOptions<T> | undefined {
	const p = ParamsParsers;
	if (Array.isArray(value)) {
		return p.required.array(
			p.required.object({
				text: p.required.string,
				value: p.required.raw as ParamsParser<T>,
			}),
		)(value).value;
	}
	if (typeof value === 'object') {
		return (p.required.raw as ParamsParser<ObjectStyleListOptions<T>>)(value)
			.value;
	}
	return undefined;
}

export function parsePickerLayout(value: unknown): PickerLayout | undefined {
	if (value === 'inline' || value === 'popup') {
		return value;
	}
	return undefined;
}

export function parsePointDimensionParams(
	value: unknown,
): PointDimensionParams | undefined {
	const p = ParamsParsers;
	return p.required.object({
		max: p.optional.number,
		min: p.optional.number,
		step: p.optional.number,
	})(value).value;
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

/**
 * @hidden
 */
export function findListItems<T>(
	constraint: Constraint<T> | undefined,
): ListItem<T>[] | null {
	const c = constraint
		? findConstraint<ListConstraint<T>>(constraint, ListConstraint)
		: null;
	if (!c) {
		return null;
	}

	return c.options;
}

function findStep(constraint: Constraint<number> | undefined): number | null {
	const c = constraint ? findConstraint(constraint, StepConstraint) : null;
	if (!c) {
		return null;
	}

	return c.step;
}

/**
 * @hidden
 */
export function getSuitableDecimalDigits(
	constraint: Constraint<number> | undefined,
	rawValue: number,
): number {
	const sc = constraint && findConstraint(constraint, StepConstraint);
	if (sc) {
		return getDecimalDigits(sc.step);
	}

	return Math.max(getDecimalDigits(rawValue), 2);
}

/**
 * @hidden
 */
export function getBaseStep(
	constraint: Constraint<number> | undefined,
): number {
	const step = findStep(constraint);
	return step ?? 1;
}

/**
 * @hidden
 */
export function getSuitableDraggingScale(
	constraint: Constraint<number> | undefined,
	rawValue: number,
): number {
	const sc = constraint && findConstraint(constraint, StepConstraint);
	const base = Math.abs(sc?.step ?? rawValue);

	return base === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(base)) - 1);
}
