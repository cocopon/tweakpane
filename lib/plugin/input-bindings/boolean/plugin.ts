import {InputParams} from '../../../api/types';
import {CompositeConstraint} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {ConstraintUtil} from '../../common/constraint/util';
import {Value} from '../../common/model/value';
import {boolFromUnknown} from '../../common/reader/boolean';
import {boolToString} from '../../common/writer/boolean';
import {InputBindingPlugin} from '../../input-binding';
import {findListItems, normalizeInputParamsOptions} from '../../util';
import {ListController} from '../common/controller/list';
import {CheckboxController} from './controller';

function createConstraint(params: InputParams): Constraint<boolean> {
	const constraints: Constraint<boolean>[] = [];

	if ('options' in params && params.options !== undefined) {
		constraints.push(
			new ListConstraint({
				options: normalizeInputParamsOptions(params.options, boolFromUnknown),
			}),
		);
	}

	return new CompositeConstraint({
		constraints: constraints,
	});
}

function createController(doc: Document, value: Value<boolean>) {
	const c = value.constraint;

	if (c && ConstraintUtil.findConstraint(c, ListConstraint)) {
		return new ListController(doc, {
			listItems: findListItems(c) ?? [],
			stringifyValue: boolToString,
			value: value,
		});
	}

	return new CheckboxController(doc, {
		value: value,
	});
}

/**
 * @hidden
 */
export const BooleanInputPlugin: InputBindingPlugin<boolean, boolean> = {
	id: 'input-bool',
	binding: {
		accept: (value) => (typeof value === 'boolean' ? value : null),
		constraint: (args) => createConstraint(args.params),
		reader: (_args) => boolFromUnknown,
		writer: (_args) => (v: boolean) => v,
	},
	controller: (args) => {
		return createController(args.document, args.binding.value);
	},
};
