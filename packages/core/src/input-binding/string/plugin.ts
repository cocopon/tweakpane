import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {ListController} from '../../common/controller/list';
import {TextController} from '../../common/controller/text';
import {formatString, stringFromUnknown} from '../../common/converter/string';
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

export interface StringInputParams extends BaseInputParams {
	options?: ListParamsOptions<string>;
}

function createConstraint(params: StringInputParams): Constraint<string> {
	const constraints: Constraint<string>[] = [];

	const lc = createListConstraint<string>(params.options);
	if (lc) {
		constraints.push(lc);
	}

	return new CompositeConstraint(constraints);
}

/**
 * @hidden
 */
export const StringInputPlugin: InputBindingPlugin<
	string,
	string,
	StringInputParams
> = {
	id: 'input-string',
	type: 'input',
	accept: (value, params) => {
		if (typeof value !== 'string') {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams<StringInputParams>(params, {
			options: p.optional.custom<ListParamsOptions<string>>(parseListOptions),
		});
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (_args) => stringFromUnknown,
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

		return new TextController(doc, {
			parser: (v) => v,
			props: ValueMap.fromObject({
				formatter: formatString,
			}),
			value: value,
			viewProps: args.viewProps,
		});
	},
};
