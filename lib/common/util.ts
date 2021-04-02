import {
	ArrayStyleListOptions,
	InputParams,
	ObjectStyleListOptions,
} from '../blade/common/api/types';
import {forceCast} from '../misc/type-util';
import {findConstraint} from './constraint/composite';
import {Constraint} from './constraint/constraint';
import {ListConstraint, ListItem} from './constraint/list';
import {StepConstraint} from './constraint/step';
import {ValueController} from './controller/value';
import {createViewProps} from './model/view-props';
import {getDecimalDigits} from './number-util';

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
 * @param params The input parameters object.
 * @return A constraint or null if not found.
 */
export function createListConstraint<T>(
	params: InputParams,
): ListConstraint<T> | null {
	if ('options' in params && params.options !== undefined) {
		return new ListConstraint(
			normalizeListOptions<T>(forceCast(params.options)),
		);
	}
	return null;
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

// TODO: Remove polyfill in the next major release
export function polyfillViewProps<T>(
	controller: ValueController<T>,
	pluginId: string,
) {
	if (!controller.viewProps) {
		(controller as any).viewProps = createViewProps();
		console.warn(
			`Missing controller.viewProps (plugin: '${pluginId}')\nThis polyfill will be removed in the next major version.`,
		);
	}
}
