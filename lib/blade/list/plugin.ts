import {ListController} from '../../common/controller/list';
import {PrimitiveValue} from '../../common/model/primitive-value';
import {ValueMap} from '../../common/model/value-map';
import {findObjectParam, findStringParam} from '../../common/params';
import {normalizeListOptions} from '../../common/util';
import {forceCast, isEmpty} from '../../misc/type-util';
import {
	ArrayStyleListOptions,
	BladeParams,
	ObjectStyleListOptions,
} from '../common/api/types';
import {LabeledController} from '../labeled/controller/labeled';
import {BladePlugin} from '../plugin';
import {ListBladeApi} from './api/list';

export interface ListBladeParams<T> extends BladeParams {
	options: ArrayStyleListOptions<T> | ObjectStyleListOptions<T>;
	value: T;
	view: 'list';

	label?: string;
}

export const ListBladePlugin = (function<T>(): BladePlugin<ListBladeParams<T>> {
	return {
		id: 'list',
		accept(params) {
			if (findStringParam(params, 'view') !== 'list') {
				return null;
			}
			const value = params['value'];
			const options = findObjectParam(params, 'options');
			if (isEmpty(value) || !options) {
				return null;
			}

			return {
				params: {
					label: findStringParam(params, 'label'),
					options: forceCast(options),
					value: forceCast(value),
					view: 'list',
				},
			};
		},
		api(args) {
			const ic = new ListController(args.document, {
				props: new ValueMap({
					options: normalizeListOptions<T>(args.params.options),
				}),
				value: new PrimitiveValue(args.params.value),
				viewProps: args.viewProps,
			});
			const c = new LabeledController(args.document, {
				blade: args.blade,
				props: new ValueMap({
					label: args.params.label,
				}),
				valueController: ic,
			});
			return new ListBladeApi(c);
		},
	};
})();
