import {ListController} from '../../common/controller/list';
import {ValueMap} from '../../common/model/value-map';
import {createValue} from '../../common/model/values';
import {ParamsParser, ParamsParsers, parseParams} from '../../common/params';
import {normalizeListOptions} from '../../common/util';
import {
	ArrayStyleListOptions,
	BladeParams,
	ObjectStyleListOptions,
} from '../common/api/types';
import {LabelController} from '../label/controller/label';
import {BladePlugin} from '../plugin';
import {ListApi} from './api/list';

type ListBladeParamsOptions<T> =
	| ArrayStyleListOptions<T>
	| ObjectStyleListOptions<T>;

export interface ListBladeParams<T> extends BladeParams {
	options: ListBladeParamsOptions<T>;
	value: T;
	view: 'list';

	label?: string;
}

function parseOptions<T>(
	value: unknown,
): ListBladeParamsOptions<T> | undefined {
	const p = ParamsParsers;
	if (Array.isArray(value)) {
		return p.required.array(
			p.required.object({
				text: p.required.string,
				value: p.required.raw as ParamsParser<T>,
			}),
		)(value).value;
	}
	if (typeof value === 'object') {
		return (p.required.raw as ParamsParser<ObjectStyleListOptions<T>>)(value)
			.value;
	}
	return undefined;
}

export const ListBladePlugin = (function<T>(): BladePlugin<ListBladeParams<T>> {
	return {
		id: 'list',
		accept(params) {
			const p = ParamsParsers;
			const result = parseParams<ListBladeParams<T>>(params, {
				options: p.required.custom<ListBladeParamsOptions<T>>(parseOptions),
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
			return new LabelController(args.document, {
				blade: args.blade,
				props: ValueMap.fromObject({
					label: args.params.label,
				}),
				valueController: ic,
			});
		},
		api(controller) {
			if (!(controller instanceof LabelController)) {
				return null;
			}
			if (!(controller.valueController instanceof ListController)) {
				return null;
			}
			return new ListApi(controller);
		},
	};
})();
