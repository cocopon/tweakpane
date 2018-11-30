// @flow

import * as StringConverter from '../../converter/string';
import CompositeConstraint from '../../constraint/composite';
import ListConstraint from '../../constraint/list';
import ConstraintUtil from '../../constraint/util';
import InputBinding from '../../binding/input';
import StringFormatter from '../../formatter/string';
import InputValue from '../../model/input-value';
import Target from '../../model/target';
import ListInputController from '../input/list';
import TextInputController from '../input/text';
import InputBindingController from '../input-binding';

import type {Constraint} from '../../constraint/constraint';

type Params = {
	options?: {text: string, value: string}[],
	label?: string,
};

function createConstraint(params: Params): Constraint<string> {
	const constraints: Constraint<string>[] = [];

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

function createController(document: Document, value: InputValue<string>) {
	const c = value.constraint;

	if (c && ConstraintUtil.findConstraint(c, ListConstraint)) {
		return new ListInputController(document, {
			stringifyValue: StringConverter.toString,
			value: value,
		});
	}

	return new TextInputController(document, {
		formatter: new StringFormatter(),
		parser: StringConverter.toString,
		value: value,
	});
}

export function create(
	document: Document,
	target: Target,
	params: Params,
): InputBindingController<string, *> {
	const value = new InputValue('', createConstraint(params));
	const binding = new InputBinding({
		reader: StringConverter.fromMixed,
		target: target,
		value: value,
	});

	return new InputBindingController(document, {
		binding: binding,
		controller: createController(document, value),
		label: params.label || target.key,
	});
}
