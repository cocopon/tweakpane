import {isEmpty} from '../../misc/type-util.js';
import {Constraint} from '../constraint/constraint.js';
import {DefiniteRangeConstraint} from '../constraint/definite-range.js';
import {RangeConstraint} from '../constraint/range.js';
import {StepConstraint} from '../constraint/step.js';
import {Formatter} from '../converter/formatter.js';
import {createNumberFormatter} from '../converter/number.js';
import {MicroParser, MicroParsers} from '../micro-parsers.js';
import {NumberTextInputParams} from '../params.js';
import {NumberTextPropsObject} from './view/number-text.js';

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

export function getSuitableDecimalDigits(
	params: NumberTextInputParams,
	rawValue: number,
): number {
	return !isEmpty(params.step)
		? getDecimalDigits(params.step)
		: Math.max(getDecimalDigits(rawValue), 2);
}

export function getSuitableKeyScale(params: NumberTextInputParams): number {
	return params.step ?? 1;
}

export function getSuitablePointerScale(
	params: NumberTextInputParams,
	rawValue: number,
): number {
	const base = Math.abs(params.step ?? rawValue);
	return base === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(base)) - 1);
}

/**
 * Tries to create a step constraint.
 * @param params The input parameters object.
 * @return A constraint or null if not found.
 */
export function createStepConstraint(
	params: {
		step?: number;
	},
	initialValue?: number,
): Constraint<number> | null {
	if (!isEmpty(params.step)) {
		return new StepConstraint(params.step, initialValue);
	}
	return null;
}

/**
 * Tries to create a range constraint.
 * @param params The input parameters object.
 * @return A constraint or null if not found.
 */
export function createRangeConstraint(params: {
	max?: number;
	min?: number;
}): Constraint<number> | null {
	if (!isEmpty(params.max) && !isEmpty(params.min)) {
		return new DefiniteRangeConstraint({
			max: params.max,
			min: params.min,
		});
	}
	if (!isEmpty(params.max) || !isEmpty(params.min)) {
		return new RangeConstraint({
			max: params.max,
			min: params.min,
		});
	}
	return null;
}

export function createNumberTextPropsObject(
	params: NumberTextInputParams,
	initialValue: number,
): NumberTextPropsObject {
	return {
		formatter:
			params.format ??
			createNumberFormatter(getSuitableDecimalDigits(params, initialValue)),
		keyScale: params.keyScale ?? getSuitableKeyScale(params),
		pointerScale:
			params.pointerScale ?? getSuitablePointerScale(params, initialValue),
	};
}

export function createNumberTextInputParamsParser(p: typeof MicroParsers) {
	return {
		format: p.optional.function as MicroParser<Formatter<number>>,
		keyScale: p.optional.number,
		max: p.optional.number,
		min: p.optional.number,
		pointerScale: p.optional.number,
		step: p.optional.number,
	};
}
