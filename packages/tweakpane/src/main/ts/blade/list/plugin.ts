import {
	BaseBladeParams,
	BladePlugin,
	createValue,
	LabeledValueController,
	ListController,
	ListParamsOptions,
	normalizeListOptions,
	ParamsParser,
	ParamsParsers,
	parseListOptions,
	parseParams,
	ValueMap,
} from '@tweakpane/core';

import {ListApi} from './api/list';

export interface ListBladeParams<T> extends BaseBladeParams {
	options: ListParamsOptions<T>;
	value: T;
	view: 'list';

	label?: string;
}

export const ListBladePlugin = (function <T>(): BladePlugin<
	ListBladeParams<T>
> {
	return {
		id: 'list',
		type: 'blade',
		accept(params) {
			const p = ParamsParsers;
			const result = parseParams<ListBladeParams<T>>(params, {
				options: p.required.custom<ListParamsOptions<T>>(parseListOptions),
				value: p.required.raw as ParamsParser<T>,
				view: p.required.constant('list'),

				label: p.optional.string,
			});
			return result ? {params: result} : null;
		},
		controller(args) {
			const ic = new ListController(args.document, {
				props: ValueMap.fromObject({
					options: normalizeListOptions<T>(args.params.options),
				}),
				value: createValue(args.params.value),
				viewProps: args.viewProps,
			});
			return new LabeledValueController<T, ListController<T>>(args.document, {
				blade: args.blade,
				props: ValueMap.fromObject({
					label: args.params.label,
				}),
				valueController: ic,
			});
		},
		api(args) {
			if (!(args.controller instanceof LabeledValueController)) {
				return null;
			}
			if (!(args.controller.valueController instanceof ListController)) {
				return null;
			}
			return new ListApi(args.controller);
		},
	};
})();
