import {
	BaseBladeParams,
	BladePlugin,
	createValue,
	Formatter,
	LabeledValueController,
	ParamsParser,
	ParamsParsers,
	parseParams,
	Parser,
	TextController,
	ValueMap,
} from '@tweakpane/core';

import {TextBladeApi} from './api/text';

export interface TextBladeParams<T> extends BaseBladeParams {
	parse: Parser<T>;
	value: T;
	view: 'text';

	format?: Formatter<T>;
	label?: string;
}

export const TextBladePlugin = (function <T>(): BladePlugin<
	TextBladeParams<T>
> {
	return {
		id: 'text',
		type: 'blade',
		accept(params) {
			const p = ParamsParsers;
			const result = parseParams<TextBladeParams<T>>(params, {
				parse: p.required.function as ParamsParser<Parser<T>>,
				value: p.required.raw as ParamsParser<T>,
				view: p.required.constant('text'),

				format: p.optional.function as ParamsParser<Formatter<T>>,
				label: p.optional.string,
			});
			return result ? {params: result} : null;
		},
		controller(args) {
			const v = createValue(args.params.value);
			const ic = new TextController(args.document, {
				parser: args.params.parse,
				props: ValueMap.fromObject({
					formatter: args.params.format ?? ((v: T) => String(v)),
				}),
				value: v,
				viewProps: args.viewProps,
			});
			return new LabeledValueController<T, TextController<T>>(args.document, {
				blade: args.blade,
				props: ValueMap.fromObject({
					label: args.params.label,
				}),
				value: v,
				valueController: ic,
			});
		},
		api(args) {
			if (!(args.controller instanceof LabeledValueController)) {
				return null;
			}
			if (!(args.controller.valueController instanceof TextController)) {
				return null;
			}
			return new TextBladeApi(args.controller);
		},
	};
})();
