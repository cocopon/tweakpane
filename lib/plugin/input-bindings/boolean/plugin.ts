import {InputParams} from '../../../api/types';
import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {boolToString} from '../../common/converter/boolean';
import {boolFromUnknown} from '../../common/converter/boolean';
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

/**
 * @hidden
 */
export const BooleanInputPlugin: InputBindingPlugin<boolean, boolean> = {
	id: 'input-bool',
	accept: (value) => (typeof value === 'boolean' ? value : null),
	binding: {
		reader: (_args) => boolFromUnknown,
		constraint: (args) => createConstraint(args.params),
		equals: equalsPrimitive,
		writer: (_args) => writePrimitive,
	},
	controller: (args) => {
		const doc = args.document;
		const value = args.value;
		const c = value.constraint;

		if (c && findConstraint(c, ListConstraint)) {
			return new ListController(doc, {
				listItems: findListItems(c) ?? [],
				stringifyValue: boolToString,
				value: value,
				viewProps: args.viewProps,
			});
		}

		return new CheckboxController(doc, {
			value: value,
			viewProps: args.viewProps,
		});
	},
};
