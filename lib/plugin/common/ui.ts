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
		downKey: ev.key === 'ArrowDown',
		shiftKey: ev.shiftKey,
		upKey: ev.key === 'ArrowUp',
	};
}

/**
 * @hidden
 */
export function getHorizontalStepKeys(ev: KeyboardEvent): StepKeys {
	return {
		altKey: ev.altKey,
		downKey: ev.key === 'ArrowLeft',
		shiftKey: ev.shiftKey,
		upKey: ev.key === 'ArrowRight',
	};
}

/**
 * @hidden
 */
export function isVerticalArrowKey(key: string): boolean {
	return key === 'ArrowUp' || key === 'ArrowDown';
}

/**
 * @hidden
 */
export function isArrowKey(key: string): boolean {
	return isVerticalArrowKey(key) || key === 'ArrowLeft' || key === 'ArrowRight';
}
