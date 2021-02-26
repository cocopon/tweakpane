import {InputParams} from '../../../api/types';
import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {formatString, stringFromUnknown} from '../../common/converter/string';
import {Value} from '../../common/model/value';
import {equalsPrimitive, writePrimitive} from '../../common/primitive';
import {InputBindingPlugin} from '../../input-binding';
import {createListConstraint, findListItems} from '../../util';
import {ListController} from '../common/controller/list';
import {TextController} from '../common/controller/text';

function createConstraint(params: InputParams): Constraint<string> {
	const constraints: Constraint<string>[] = [];

	const lc = createListConstraint(params, stringFromUnknown);
	if (lc) {
		constraints.push(lc);
	}

	return new CompositeConstraint(constraints);
}

function createController(doc: Document, value: Value<string>) {
	const c = value.constraint;

	if (c && findConstraint(c, ListConstraint)) {
		return new ListController(doc, {
			listItems: findListItems(c) ?? [],
			stringifyValue: (v) => v,
			value: value,
		});
	}

	return new TextController(doc, {
		formatter: formatString,
		parser: (v) => v,
		value: value,
	});
}

/**
 * @hidden
 */
export const StringInputPlugin: InputBindingPlugin<string, string> = {
	id: 'input-string',
	binding: {
		accept: (value, _params) => (typeof value === 'string' ? value : null),
		reader: (_args) => stringFromUnknown,
		constraint: (args) => createConstraint(args.params),
		compare: equalsPrimitive,
		writer: (_args) => writePrimitive,
	},
	controller: (params) => {
		return createController(params.document, params.value);
	},
};
