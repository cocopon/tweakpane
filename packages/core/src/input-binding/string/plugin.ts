import {InputBindingController} from '../../blade/binding/controller/input-binding';
import {StringInputParams} from '../../blade/common/api/params';
import {ListInputBindingApi} from '../../common/api/list';
import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {ListController} from '../../common/controller/list';
import {TextController} from '../../common/controller/text';
import {formatString, stringFromUnknown} from '../../common/converter/string';
import {createListConstraint, parseListOptions} from '../../common/list-util';
import {parseRecord} from '../../common/micro-parsers';
import {ValueMap} from '../../common/model/value-map';
import {ListParamsOptions} from '../../common/params';
import {writePrimitive} from '../../common/primitive';
import {VERSION} from '../../version';
import {InputBindingPlugin} from '../plugin';

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
	core: VERSION,
	accept: (value, params) => {
		if (typeof value !== 'string') {
			return null;
		}
		const result = parseRecord<StringInputParams>(params, (p) => ({
			readonly: p.optional.constant(false),
			options: p.optional.custom<ListParamsOptions<string>>(parseListOptions),
		}));
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

		const lc = c && findConstraint<ListConstraint<string>>(c, ListConstraint);
		if (lc) {
			return new ListController(doc, {
				props: new ValueMap({
					options: lc.values.value('options'),
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
	api(args) {
		if (typeof args.controller.value.rawValue !== 'string') {
			return null;
		}

		if (args.controller.valueController instanceof ListController) {
			return new ListInputBindingApi(
				args.controller as InputBindingController<
					string,
					ListController<string>
				>,
			);
		}

		return null;
	},
};
