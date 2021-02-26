import {InputParams} from '../../../api/types';
import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {boolToString} from '../../common/converter/boolean';
import {boolFromUnknown} from '../../common/converter/boolean';
import {Value} from '../../common/model/value';
import {equalsPrimitive, writePrimitive} from '../../common/primitive';
import {InputBindingPlugin} from '../../input-binding';
import {createListConstraint, findListItems} from '../../util';
import {ListController} from '../common/controller/list';
import {CheckboxController} from './controller';

function createConstraint(params: InputParams): Constraint<boolean> {
	const constraints: Constraint<boolean>[] = [];

	const lc = createListConstraint(params, boolFromUnknown);
	if (lc) {
		constraints.push(lc);
	}

	return new CompositeConstraint(constraints);
}

function createController(doc: Document, value: Value<boolean>) {
	const c = value.constraint;

	if (c && findConstraint(c, ListConstraint)) {
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
		reader: (_args) => boolFromUnknown,
		constraint: (args) => createConstraint(args.params),
		compare: equalsPrimitive,
		writer: (_args) => writePrimitive,
	},
	controller: (args) => {
		return createController(args.document, args.value);
	},
};
