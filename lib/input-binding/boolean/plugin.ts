import {InputParams} from '../../blade/common/api/types';
import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {ListController} from '../../common/controller/list';
import {boolFromUnknown} from '../../common/converter/boolean';
import {ValueMap} from '../../common/model/value-map';
import {writePrimitive} from '../../common/primitive';
import {createListConstraint, findListItems} from '../../common/util';
import {InputBindingPlugin} from '../plugin';
import {CheckboxController} from './controller/checkbox';

function createConstraint(params: InputParams): Constraint<boolean> {
	const constraints: Constraint<boolean>[] = [];

	const lc = createListConstraint<boolean>(params);
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
		writer: (_args) => writePrimitive,
	},
	controller: (args) => {
		const doc = args.document;
		const value = args.value;
		const c = args.constraint;

		if (c && findConstraint(c, ListConstraint)) {
			return new ListController(doc, {
				props: new ValueMap({
					options: findListItems(c) ?? [],
				}),
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
