import {InputParamsOption, InputParamsOptionDictionary} from '../api/types';
import {Constraint} from '../constraint/constraint';
import Point2dConstraint from '../constraint/point-2d';
import RangeConstraint from '../constraint/range';
import StepConstraint from '../constraint/step';
import ConstraintUtil from '../constraint/util';
import NumberUtil from '../misc/number-util';
import TypeUtil, {Class} from '../misc/type-util';
import Point2d from '../model/point-2d';
import FolderController from './folder';
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
	return texts.reduce(
		(result, text) => {
			return result.concat({
				text: text,
				value: convert(textToValueMap[text]),
			});
		},
		[] as InputParamsOption<T2>[],
	);
}

/**
 * @hidden
 */
export function findControllers<Controller>(
	uiControllers: UiController[],
	controllerClass: Class<Controller>,
): Controller[] {
	return uiControllers.reduce(
		(results, uc) => {
			if (uc instanceof FolderController) {
				// eslint-disable-next-line no-use-before-define
				results.push(
					...findControllers(uc.uiControllerList.items, controllerClass),
				);
			}

			if (uc instanceof controllerClass) {
				results.push(uc);
			}

			return results;
		},
		[] as Controller[],
	);
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
	keyCode: number;
	shiftKey: boolean;
}

/**
 * @hidden
 */
export function getStepForKey(baseStep: number, keys: StepKeys): number {
	const step = baseStep * (keys.altKey ? 0.1 : 1) * (keys.shiftKey ? 10 : 1);

	if (keys.keyCode === 38) {
		return +step;
	} else if (keys.keyCode === 40) {
		return -step;
	}
	return 0;
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
function getSuitableMaxDimensionValue(
	constraint: Constraint<number> | undefined,
	rawValue: number,
): number {
	const rc =
		constraint && ConstraintUtil.findConstraint(constraint, RangeConstraint);
	if (rc) {
		return Math.max(Math.abs(rc.minValue || 0), Math.abs(rc.maxValue || 0));
	}

	const step = getStepForTextInput(constraint);
	return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
}

/**
 * @hidden
 */
export function getSuitableMaxValueForPoint2dPad(
	constraint: Constraint<Point2d> | undefined,
	rawValue: Point2d,
): number {
	const xc =
		constraint instanceof Point2dConstraint
			? constraint.xConstraint
			: undefined;
	const yc =
		constraint instanceof Point2dConstraint
			? constraint.yConstraint
			: undefined;
	const xr = getSuitableMaxDimensionValue(xc, rawValue.x);
	const yr = getSuitableMaxDimensionValue(yc, rawValue.y);
	return Math.max(xr, yr);
}
