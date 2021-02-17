import {InputParamsOption, InputParamsOptionDictionary} from '../api/types';
import {Constraint} from '../constraint/constraint';
import {StepConstraint} from '../constraint/step';
import {ConstraintUtil} from '../constraint/util';
import {NumberUtil} from '../misc/number-util';
import {Class, TypeUtil} from '../misc/type-util';
import {FolderController} from './folder';
import {UiController} from './ui';

/**
 * @hidden
 */
export function normalizeInputParamsOptions<T1, T2>(
	options: InputParamsOption<T1>[] | InputParamsOptionDictionary<T1>,
	convert: (value: T1) => T2,
): InputParamsOption<T2>[] {
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
	}, [] as InputParamsOption<T2>[]);
}

/**
 * @hidden
 */
export function findControllers<Controller>(
	uiControllers: UiController[],
	controllerClass: Class<Controller>,
): Controller[] {
	return uiControllers.reduce((results, uc) => {
		if (uc instanceof FolderController) {
			// eslint-disable-next-line no-use-before-define
			results.push(...findControllers(uc.uiContainer.items, controllerClass));
		}

		if (uc instanceof controllerClass) {
			results.push(uc);
		}

		return results;
	}, [] as Controller[]);
}

function findStep(constraint: Constraint<number> | undefined): number | null {
	const c = constraint
		? ConstraintUtil.findConstraint(constraint, StepConstraint)
		: null;
	if (!c) {
		return null;
	}

	return c.step;
}

/**
 * @hidden
 */
export function getStepForTextInput(
	constraint: Constraint<number> | undefined,
): number {
	const step = findStep(constraint);
	return TypeUtil.getOrDefault<number>(step, 1);
}

interface StepKeys {
	altKey: boolean;
	downKey: boolean;
	shiftKey: boolean;
	upKey: boolean;
}

/**
 * @hidden
 */
export function getStepForKey(baseStep: number, keys: StepKeys): number {
	const step = baseStep * (keys.altKey ? 0.1 : 1) * (keys.shiftKey ? 10 : 1);

	if (keys.upKey) {
		return +step;
	} else if (keys.downKey) {
		return -step;
	}
	return 0;
}

/**
 * @hidden
 */
export function getVerticalStepKeys(ev: KeyboardEvent): StepKeys {
	return {
		altKey: ev.altKey,
		downKey: ev.keyCode === 40,
		shiftKey: ev.shiftKey,
		upKey: ev.keyCode === 38,
	};
}

/**
 * @hidden
 */
export function getHorizontalStepKeys(ev: KeyboardEvent): StepKeys {
	return {
		altKey: ev.altKey,
		downKey: ev.keyCode === 37,
		shiftKey: ev.shiftKey,
		upKey: ev.keyCode === 39,
	};
}

/**
 * @hidden
 */
export function isVerticalArrowKey(keyCode: number): boolean {
	return keyCode === 38 || keyCode === 40;
}

/**
 * @hidden
 */
export function isArrowKey(keyCode: number): boolean {
	return isVerticalArrowKey(keyCode) || keyCode === 37 || keyCode === 39;
}

/**
 * @hidden
 */
export function getSuitableDecimalDigits(
	constraint: Constraint<number> | undefined,
	rawValue: number,
): number {
	const sc =
		constraint && ConstraintUtil.findConstraint(constraint, StepConstraint);
	if (sc) {
		return NumberUtil.getDecimalDigits(sc.step);
	}

	return Math.max(NumberUtil.getDecimalDigits(rawValue), 2);
}

/**
 * @hidden
 */
export function getBaseStepForColor(forAlpha: boolean): number {
	return forAlpha ? 0.1 : 1;
}
