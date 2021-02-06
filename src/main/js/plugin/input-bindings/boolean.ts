import {InputParams} from '../../api/types';
import {InputBinding} from '../../binding/input';
import {CompositeConstraint} from '../../constraint/composite';
import {Constraint} from '../../constraint/constraint';
import {ListConstraint} from '../../constraint/list';
import {ConstraintUtil} from '../../constraint/util';
import {CheckboxInputController} from '../../controller/input/checkbox';
import {ListInputController} from '../../controller/input/list';
import * as UiUtil from '../../controller/ui-util';
import * as BooleanConverter from '../../converter/boolean';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import {InputBindingPlugin} from '../input-binding';

function createConstraint(params: InputParams): Constraint<boolean> {
	const constraints: Constraint<boolean>[] = [];

	if ('options' in params && params.options !== undefined) {
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
			viewModel: new ViewModel(),
			stringifyValue: BooleanConverter.toString,
			value: value,
		});
	}

	return new CheckboxInputController(document, {
		viewModel: new ViewModel(),
		value: value,
	});
}

/**
 * @hidden
 */
export const BooleanInputPlugin: InputBindingPlugin<boolean, boolean> = {
	getInitialValue: (value) => (typeof value === 'boolean' ? value : null),
	createBinding: (params) => {
		const value = new InputValue(false, createConstraint(params.inputParams));
		return new InputBinding({
			reader: BooleanConverter.fromMixed,
			target: params.target,
			value: value,
			writer: (v) => v,
		});
	},
	createController: (params) => {
		return createController(params.document, params.binding.value);
	},
};
