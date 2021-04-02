import {PrimitiveValue} from '../../common/model/primitive-value';
import {ValueMap} from '../../common/model/value-map';
import {
	findBooleanParam,
	findObjectParam,
	findStringParam,
} from '../../common/params';
import {normalizeListOptions} from '../../common/util';
import {ListController} from '../../input-binding/common/controller/list';
import {forceCast, isEmpty} from '../../misc/type-util';
import {
	ArrayStyleListOptions,
	BladeParams,
	ObjectStyleListOptions,
} from '../common/api/types';
import {LabeledController} from '../labeled/controller';
import {BladePlugin} from '../plugin';
import {ListBladeApi} from './api/list';

export interface ListBladeParams<T> extends BladeParams {
	options: ArrayStyleListOptions<T> | ObjectStyleListOptions<T>;
	value: T;
	view: 'list';

	label?: string;
}

function createParams<T>(
	params: Record<string, unknown>,
): ListBladeParams<T> | null {
	if (findStringParam(params, 'view') !== 'list') {
		return null;
	}
	const value = params['value'];
	const options = findObjectParam(params, 'options');
	if (isEmpty(value) || !options) {
		return null;
	}

	return {
		disabled: findBooleanParam(params, 'disabled'),
		label: findStringParam(params, 'label'),
		options: forceCast(options),
		value: forceCast(value),
		view: 'list',
	};
}

export const ListBladePlugin = (function<T>(): BladePlugin<ListBladeParams<T>> {
	return {
		id: 'list',
		accept(params) {
			const p = createParams<T>(params);
			return p ? {params: p} : null;
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
