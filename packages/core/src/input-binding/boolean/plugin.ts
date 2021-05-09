import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {ListController} from '../../common/controller/list';
import {boolFromUnknown} from '../../common/converter/boolean';
import {ValueMap} from '../../common/model/value-map';
import {BaseInputParams, ListParamsOptions} from '../../common/params';
import {ParamsParsers, parseParams} from '../../common/params-parsers';
import {writePrimitive} from '../../common/primitive';
import {
	createListConstraint,
	findListItems,
	parseListOptions,
} from '../../common/util';
import {InputBindingPlugin} from '../plugin';
import {CheckboxController} from './controller/checkbox';

export interface BooleanInputParams extends BaseInputParams {
	options?: ListParamsOptions<boolean>;
}

function createConstraint(params: BooleanInputParams): Constraint<boolean> {
	const constraints: Constraint<boolean>[] = [];

	const lc = createListConstraint<boolean>(params.options);
	if (lc) {
		constraints.push(lc);
	}

	return new CompositeConstraint(constraints);
}

/**
 * @hidden
 */
export const BooleanInputPlugin: InputBindingPlugin<
	boolean,
	boolean,
	BooleanInputParams
> = {
	id: 'input-bool',
	type: 'input',
	accept: (value, params) => {
		if (typeof value !== 'boolean') {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams<BooleanInputParams>(params, {
			options: p.optional.custom<ListParamsOptions<boolean>>(parseListOptions),
		});
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
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
				props: ValueMap.fromObject({
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
