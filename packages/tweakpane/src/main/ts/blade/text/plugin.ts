import {
	BaseBladeParams,
	BladePlugin,
	createValue,
	Formatter,
	LabeledValueBladeController,
	LabelPropsObject,
	MicroParser,
	Parser,
	parseRecord,
	TextController,
	ValueMap,
	VERSION,
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
		core: VERSION,
		accept(params) {
			const result = parseRecord<TextBladeParams<T>>(params, (p) => ({
				parse: p.required.function as MicroParser<Parser<T>>,
				value: p.required.raw as MicroParser<T>,
				view: p.required.constant('text'),

				format: p.optional.function as MicroParser<Formatter<T>>,
				label: p.optional.string,
			}));
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
			return new LabeledValueBladeController<T, TextController<T>>(
				args.document,
				{
					blade: args.blade,
					props: ValueMap.fromObject<LabelPropsObject>({
						label: args.params.label,
					}),
					value: v,
					valueController: ic,
				},
			);
		},
		api(args) {
			if (!(args.controller instanceof LabeledValueBladeController)) {
				return null;
			}
			if (!(args.controller.valueController instanceof TextController)) {
				return null;
			}
			return new TextBladeApi(args.controller);
		},
	};
})();
