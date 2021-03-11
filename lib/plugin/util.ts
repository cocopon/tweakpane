import {
	InputParams,
	InputParamsOption,
	InputParamsOptionDictionary,
} from '../api/types';
import {findConstraint} from './common/constraint/composite';
import {Constraint} from './common/constraint/constraint';
import {ListConstraint, ListItem} from './common/constraint/list';
import {StepConstraint} from './common/constraint/step';
import {getDecimalDigits} from './common/number-util';

function normalizeInputParamsOptions<T>(
	options: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>,
	convert: (value: unknown) => T,
): InputParamsOption<T>[] {
	if (Array.isArray(options)) {
		return options.map((item) => {
			return {
				text: item.text,
				value: convert(item.value),
			};
		});
	}

	const textToValueMap = options;
	const texts = Object.keys(textToValueMap);
	return texts.reduce((result, text) => {
		return result.concat({
			text: text,
			value: convert(textToValueMap[text]),
		});
	}, [] as InputParamsOption<T>[]);
}

/**
 * Tries to create a list constraint.
 * @template T The type of the raw value.
 * @param params The input parameters object.
 * @param convert The converter that converts unknown value into T.
 * @return A constraint or null if not found.
 */
export function createListConstraint<T>(
	params: InputParams,
	convert: (value: unknown) => T,
): ListConstraint<T> | null {
	if ('options' in params && params.options !== undefined) {
		return new ListConstraint(
			normalizeInputParamsOptions(params.options, convert),
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
