// @flow

import * as NumberConverter from '../../converter/number';
import CompositeConstraint from '../../constraint/composite';
import ListConstraint from '../../constraint/list';
import ConstraintUtil from '../../constraint/util';
import RangeConstraint from '../../constraint/range';
import StepConstraint from '../../constraint/step';
import InputBinding from '../../binding/input';
import NumberFormatter from '../../formatter/number';
import NumberUtil from '../../misc/number-util';
import InputValue from '../../model/input-value';
import Target from '../../model/target';
import NumberParser from '../../parser/number';
import ListInputController from '../input/list';
import NumberTextInputController from '../input/number-text';
import SliderTextInputController from '../input/slider-text';
import InputBindingController from '../input-binding';

import type {Constraint} from '../../constraint/constraint';

type Params = {
	options?: {text: string, value: number}[],
	label?: string,
	max?: number,
	min?: number,
	step?: number,
};

function createConstraint(params: Params): Constraint<number> {
	const constraints: Constraint<number>[] = [];

	if (params.step !== null && params.step !== undefined) {
		constraints.push(
			new StepConstraint({
				step: params.step,
			}),
		);
	}

	if (
		(params.max !== null && params.max !== undefined) ||
		(params.min !== null && params.min !== undefined)
	) {
		constraints.push(
			new RangeConstraint({
				max: params.max,
				min: params.min,
			}),
		);
	}

	if (params.options) {
		constraints.push(
			new ListConstraint({
				options: params.options,
			}),
		);
	}

	return new CompositeConstraint({
		constraints: constraints,
	});
}

function getSuitableDecimalDigits(value: InputValue<number>): number {
	const c = value.constraint;
	const sc = c && ConstraintUtil.findConstraint(c, StepConstraint);
	if (sc) {
		return NumberUtil.getDecimalDigits(sc.step);
	}

	return Math.max(NumberUtil.getDecimalDigits(value.rawValue), 2);
}

function createController(document: Document, value: InputValue<number>) {
	const c = value.constraint;

	if (c && ConstraintUtil.findConstraint(c, ListConstraint)) {
		return new ListInputController(document, {
			stringifyValue: NumberConverter.toString,
			value: value,
		});
	}

	if (c && ConstraintUtil.findConstraint(c, RangeConstraint)) {
		return new SliderTextInputController(document, {
			formatter: new NumberFormatter(getSuitableDecimalDigits(value)),
			parser: NumberParser,
			value: value,
		});
	}

	return new NumberTextInputController(document, {
		formatter: new NumberFormatter(getSuitableDecimalDigits(value)),
		parser: NumberParser,
		value: value,
	});
}

export function create(
	document: Document,
	target: Target,
	params: Params,
): InputBindingController<number, *> {
	const value = new InputValue(0, createConstraint(params));
	const binding = new InputBinding({
		reader: NumberConverter.fromMixed,
		target: target,
		value: value,
	});

	return new InputBindingController(document, {
		binding: binding,
		controller: createController(document, value),
		label: params.label || target.key,
	});
}
