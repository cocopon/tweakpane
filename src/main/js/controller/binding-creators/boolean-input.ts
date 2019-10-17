import InputBinding from '../../binding/input';
import CompositeConstraint from '../../constraint/composite';
import ListConstraint from '../../constraint/list';
import ConstraintUtil from '../../constraint/util';
import * as BooleanConverter from '../../converter/boolean';
import InputValue from '../../model/input-value';
import Target from '../../model/target';
import InputBindingController from '../input-binding';
import CheckboxInputController from '../input/checkbox';
import ListInputController from '../input/list';

import {Constraint} from '../../constraint/constraint';
import {InputParams} from '../ui';
import * as UiUtil from '../ui-util';

function createConstraint(params: InputParams): Constraint<boolean> {
	const constraints: Constraint<boolean>[] = [];

	if (params.options) {
		constraints.push(
			new ListConstraint({
				options: UiUtil.normalizeInputParamsOptions(
					params.options,
					BooleanConverter.fromMixed,
				),
			}),
		);
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

/**
 * @hidden
 */
export function create(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<boolean, boolean> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'boolean') {
		return null;
	}

	const value = new InputValue(false, createConstraint(params));
	const binding = new InputBinding({
		reader: BooleanConverter.fromMixed,
		target: target,
		value: value,
		writer: (v) => v,
	});

	return new InputBindingController(document, {
		binding: binding,
		controller: createController(document, value),
		label: params.label || target.key,
	});
}
