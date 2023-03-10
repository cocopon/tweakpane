import {findConstraint} from './constraint/composite';
import {Constraint} from './constraint/constraint';
import {StepConstraint} from './constraint/step';

export function mapRange(
	value: number,
	start1: number,
	end1: number,
	start2: number,
	end2: number,
): number {
	const p = (value - start1) / (end1 - start1);
	return start2 + p * (end2 - start2);
}

export function getDecimalDigits(value: number): number {
	const text = String(value.toFixed(10));
	const frac = text.split('.')[1];
	return frac.replace(/0+$/, '').length;
}

export function constrainRange(
	value: number,
	min: number,
	max: number,
): number {
	return Math.min(Math.max(value, min), max);
}

export function loopRange(value: number, max: number): number {
	return ((value % max) + max) % max;
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
