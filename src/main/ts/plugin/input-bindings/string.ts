import {InputParams} from '../../api/types';
import {CompositeConstraint} from '../../constraint/composite';
import {Constraint} from '../../constraint/constraint';
import {ListConstraint} from '../../constraint/list';
import {ConstraintUtil} from '../../constraint/util';
import {ListInputController} from '../../controller/input/list';
import {TextInputController} from '../../controller/input/text';
import * as UiUtil from '../../controller/ui-util';
import * as StringConverter from '../../converter/string';
import {StringFormatter} from '../../formatter/string';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import {InputBindingPlugin} from '../input-binding';
import {findListItems} from '../util';

function createConstraint(params: InputParams): Constraint<string> {
	const constraints: Constraint<string>[] = [];

	if ('options' in params && params.options !== undefined) {
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
			listItems: findListItems(c) ?? [],
			stringifyValue: StringConverter.toString,
			value: value,
			viewModel: new ViewModel(),
		});
	}

	return new TextInputController(document, {
		formatter: new StringFormatter(),
		parser: StringConverter.toString,
		value: value,
		viewModel: new ViewModel(),
	});
}

/**
 * @hidden
 */
export const StringInputPlugin: InputBindingPlugin<string, string> = {
	model: {
		accept: (value, _params) => (typeof value === 'string' ? value : null),
		reader: (_args) => StringConverter.fromMixed,
		writer: (_args) => (v) => v,
		constraint: (args) => createConstraint(args.params),
	},
	controller: (params) => {
		return createController(params.document, params.binding.value);
	},
};
