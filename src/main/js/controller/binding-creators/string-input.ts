import {InputParams} from '../../api/types';
import InputBinding from '../../binding/input';
import CompositeConstraint from '../../constraint/composite';
import {Constraint} from '../../constraint/constraint';
import ListConstraint from '../../constraint/list';
import ConstraintUtil from '../../constraint/util';
import * as StringConverter from '../../converter/string';
import StringFormatter from '../../formatter/string';
import InputValue from '../../model/input-value';
import Target from '../../model/target';
import InputBindingController from '../input-binding';
import ListInputController from '../input/list';
import TextInputController from '../input/text';
import * as UiUtil from '../ui-util';

function createConstraint(params: InputParams): Constraint<string> {
	const constraints: Constraint<string>[] = [];

	if (params.options) {
		constraints.push(
			new ListConstraint({
				options: UiUtil.normalizeInputParamsOptions(
					params.options,
					StringConverter.fromMixed,
				),
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

/**
 * @hidden
 */
export function create(
	document: Document,
	target: Target,
	params: InputParams,
): InputBindingController<string, string> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'string') {
		return null;
	}

	const value = new InputValue('', createConstraint(params));
	const binding = new InputBinding({
		reader: StringConverter.fromMixed,
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
