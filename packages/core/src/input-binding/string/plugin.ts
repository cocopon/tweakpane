import {InputBindingController} from '../../blade/binding/controller/input-binding.js';
import {StringInputParams} from '../../blade/common/api/params.js';
import {ListInputBindingApi} from '../../common/api/list.js';
import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite.js';
import {Constraint} from '../../common/constraint/constraint.js';
import {ListConstraint} from '../../common/constraint/list.js';
import {ListController} from '../../common/controller/list.js';
import {TextController} from '../../common/controller/text.js';
import {
	formatString,
	stringFromUnknown,
} from '../../common/converter/string.js';
import {
	createListConstraint,
	parseListOptions,
} from '../../common/list-util.js';
import {parseRecord} from '../../common/micro-parsers.js';
import {ValueMap} from '../../common/model/value-map.js';
import {ListParamsOptions} from '../../common/params.js';
import {writePrimitive} from '../../common/primitive.js';
import {createPlugin} from '../../plugin/plugin.js';
import {InputBindingPlugin} from '../plugin.js';

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
> = createPlugin({
	id: 'input-string',
	type: 'input',
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
});
