import {
	BaseBladeParams,
	BladePlugin,
	createValue,
	LabeledValueController,
	ListConstraint,
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
			const lc = new ListConstraint(
				normalizeListOptions<T>(args.params.options),
			);
			const value = createValue(args.params.value, {
				constraint: lc,
			});
			const ic = new ListController(args.document, {
				props: new ValueMap({
					options: lc.values.value('options'),
				}),
				value: value,
				viewProps: args.viewProps,
			});
			return new LabeledValueController<T, ListController<T>>(args.document, {
				blade: args.blade,
				props: ValueMap.fromObject({
					label: args.params.label,
				}),
				value: value,
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
