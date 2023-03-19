import {
	BaseBladeParams,
	BladePlugin,
	createValue,
	LabeledValueBladeController,
	LabelPropsObject,
	ListConstraint,
	ListController,
	ListParamsOptions,
	MicroParser,
	normalizeListOptions,
	parseListOptions,
	parseRecord,
	ValueMap,
	VERSION,
} from '@tweakpane/core';

import {ListBladeApi} from './api/list';

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
		core: VERSION,
		accept(params) {
			const result = parseRecord<ListBladeParams<T>>(params, (p) => ({
				options: p.required.custom<ListParamsOptions<T>>(parseListOptions),
				value: p.required.raw as MicroParser<T>,
				view: p.required.constant('list'),

				label: p.optional.string,
			}));
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
			return new LabeledValueBladeController<T, ListController<T>>(
				args.document,
				{
					blade: args.blade,
					props: ValueMap.fromObject<LabelPropsObject>({
						label: args.params.label,
					}),
					value: value,
					valueController: ic,
				},
			);
		},
		api(args) {
			if (!(args.controller instanceof LabeledValueBladeController)) {
				return null;
			}
			if (!(args.controller.valueController instanceof ListController)) {
				return null;
			}
			return new ListBladeApi(args.controller);
		},
	};
})();
