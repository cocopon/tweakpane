// @flow

import * as BooleanConverter from '../../converter/boolean';
import CompositeConstraint from '../../constraint/composite';
import ListConstraint from '../../constraint/list';
import ConstraintUtil from '../../constraint/util';
import InputBinding from '../../binding/input';
import InputValue from '../../model/input-value';
import Target from '../../model/target';
import CheckboxInputController from '../input/checkbox';
import ListInputController from '../input/list';
import InputBindingController from '../input-binding';

import type {Constraint} from '../../constraint/constraint';

type Params = {
	options?: {text: string, value: boolean}[],
	label?: string,
};

function createConstraint(params: Params): Constraint<boolean> {
	const constraints: Constraint<boolean>[] = [];

	if (params.options) {
		constraints.push(new ListConstraint({
			options: params.options,
		}));
	}

	return new CompositeConstraint({
		constraints: constraints,
	});
}

function createController(document: Document, value: InputValue<boolean>) {
	const c = value.constraint;

	if (c && ConstraintUtil.findConstraint(c, ListConstraint)) {
		return new ListInputController(document, {
			stringifyValue: BooleanConverter.toString,
			value: value,
		});
	}

	return new CheckboxInputController(document, {
		value: value,
	});
}

export function create(document: Document, target: Target, params: Params): InputBindingController<boolean, *> {
	const value = new InputValue(
		false,
		createConstraint(params),
	);
	const binding = new InputBinding({
		reader: BooleanConverter.fromMixed,
		target: target,
		value: value,
	});

	return new InputBindingController(document, {
		binding: binding,
		controller: createController(document, value),
		label: params.label || target.key,
	});
}
