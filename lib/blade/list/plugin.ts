import {ListController} from '../../common/controller/list';
import {ValueMap} from '../../common/model/value-map';
import {createValue} from '../../common/model/values';
import {
	ParamsParser,
	ParamsParsers,
	parseParams,
} from '../../common/params-parsers';
import {normalizeListOptions, parseListOptions} from '../../common/util';
import {BladeParams, ListParamsOptions} from '../common/api/params';
import {LabeledValueController} from '../label/controller/value-label';
import {BladePlugin} from '../plugin';
import {ListApi} from './api/list';

export interface ListBladeParams<T> extends BladeParams {
	options: ListParamsOptions<T>;
	value: T;
	view: 'list';

	label?: string;
}

export const ListBladePlugin = (function<T>(): BladePlugin<ListBladeParams<T>> {
	return {
		id: 'list',
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
		api(controller) {
			if (!(controller instanceof LabeledValueController)) {
				return null;
			}
			if (!(controller.valueController instanceof ListController)) {
				return null;
			}
			return new ListApi(controller);
		},
	};
})();
