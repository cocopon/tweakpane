import {Constraint} from '../constraint/constraint';
import StepConstraint from '../constraint/step';
import ConstraintUtil from '../constraint/util';
import TypeUtil, {Class} from '../misc/type-util';
import FolderController from './folder';
import {UiController} from './ui';

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
