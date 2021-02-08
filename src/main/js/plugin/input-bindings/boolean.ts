import {InputParams} from '../../api/types';
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
	model: {
		accept: (value) => (typeof value === 'boolean' ? value : null),
		reader: (_args) => BooleanConverter.fromMixed,
		writer: (_args) => (v) => v,
		constraint: (args) => createConstraint(args.params),
	},
	controller: (args) => {
		return createController(args.document, args.binding.value);
	},
};
