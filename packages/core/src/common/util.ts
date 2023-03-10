import {findConstraint} from './constraint/composite';
import {Constraint} from './constraint/constraint';
import {StepConstraint} from './constraint/step';
import {getDecimalDigits} from './number-util';
import {PickerLayout} from './params';

export function parsePickerLayout(value: unknown): PickerLayout | undefined {
	if (value === 'inline' || value === 'popup') {
		return value;
	}
	return undefined;
}

function findStep(constraint: Constraint<number> | undefined): number | null {
	const c = constraint ? findConstraint(constraint, StepConstraint) : null;
	if (!c) {
		return null;
	}

	return c.step;
}

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

export function getBaseStep(
	constraint: Constraint<number> | undefined,
): number {
	const step = findStep(constraint);
	return step ?? 1;
}

export function getSuitableDraggingScale(
	constraint: Constraint<number> | undefined,
	rawValue: number,
): number {
	const sc = constraint && findConstraint(constraint, StepConstraint);
	const base = Math.abs(sc?.step ?? rawValue);

	return base === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(base)) - 1);
}
