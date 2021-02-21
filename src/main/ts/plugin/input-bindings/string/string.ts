import {InputParams} from '../../../api/types';
import {CompositeConstraint} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {ConstraintUtil} from '../../common/constraint/util';
import {StringFormatter} from '../../common/formatter/string';
import {Value} from '../../common/model/value';
import {ViewModel} from '../../common/model/view-model';
import {stringFromUnknown} from '../../common/parser/string';
import {InputBindingPlugin} from '../../input-binding';
import {findListItems, normalizeInputParamsOptions} from '../../util';
import {ListController} from '../common/controller/list';
import {TextController} from '../common/controller/text';

function createConstraint(params: InputParams): Constraint<string> {
	const constraints: Constraint<string>[] = [];

	if ('options' in params && params.options !== undefined) {
		constraints.push(
			new ListConstraint({
				options: normalizeInputParamsOptions(params.options, stringFromUnknown),
			}),
		);
	}

	return new CompositeConstraint({
		constraints: constraints,
	});
}

function createController(document: Document, value: Value<string>) {
	const c = value.constraint;

	if (c && ConstraintUtil.findConstraint(c, ListConstraint)) {
		return new ListController(document, {
			listItems: findListItems(c) ?? [],
			stringifyValue: (v) => v,
			value: value,
			viewModel: new ViewModel(),
		});
	}

	return new TextController(document, {
		formatter: new StringFormatter(),
		parser: (v) => v,
		value: value,
		viewModel: new ViewModel(),
	});
}

/**
 * @hidden
 */
export const StringInputPlugin: InputBindingPlugin<string, string> = {
	id: 'input-string',
	model: {
		accept: (value, _params) => (typeof value === 'string' ? value : null),
		constraint: (args) => createConstraint(args.params),
		reader: (_args) => stringFromUnknown,
		writer: (_args) => (v: string) => v,
	},
	controller: (params) => {
		return createController(params.document, params.binding.value);
	},
};
