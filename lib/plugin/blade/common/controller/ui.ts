import {Class} from '../../../../misc/type-util';
import {ButtonController} from '../../button/controller';
import {FolderController} from '../../folder/controller';
import {SeparatorController} from '../../separator/controller';
import {InputBindingController} from './input-binding';
import {MonitorBindingController} from './monitor-binding';

/**
 * @hidden
 */
export type UiController =
	| ButtonController
	| FolderController
	| SeparatorController
	| InputBindingController<unknown, unknown>
	| MonitorBindingController<unknown>;

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
export function getBaseStepForColor(forAlpha: boolean): number {
	return forAlpha ? 0.1 : 1;
}
