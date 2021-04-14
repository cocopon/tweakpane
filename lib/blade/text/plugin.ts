import {TextController} from '../../common/controller/text';
import {Formatter} from '../../common/converter/formatter';
import {Parser} from '../../common/converter/parser';
import {PrimitiveValue} from '../../common/model/primitive-value';
import {ValueMap} from '../../common/model/value-map';
import {findFunctionParam, findStringParam} from '../../common/params';
import {forceCast} from '../../misc/type-util';
import {BladeParams} from '../common/api/types';
import {LabelController} from '../label/controller/label';
import {BladePlugin} from '../plugin';
import {TextApi} from './api/text';

export interface TextBladeParams<T> extends BladeParams {
	parse: Parser<T>;
	value: T;
	view: 'text';

	format?: Formatter<T>;
	label?: string;
}

export const TextBladePlugin = (function<T>(): BladePlugin<TextBladeParams<T>> {
	return {
		id: 'text',
		accept(params) {
			if (findStringParam(params, 'view') !== 'text') {
				return null;
			}
			const parser = findFunctionParam(params, 'parse');
			const value = params['value'];
			if (!parser || !value) {
				return null;
			}
			return {
				params: {
					format: forceCast(findFunctionParam(params, 'format')),
					label: findStringParam(params, 'label'),
					parse: forceCast(parser),
					value: forceCast(value),
					view: 'text',
				},
			};
		},
		controller(args) {
			const ic = new TextController(args.document, {
				parser: args.params.parse,
				props: new ValueMap({
					formatter: args.params.format ?? ((v: T) => String(v)),
				}),
				value: new PrimitiveValue(args.params.value),
				viewProps: args.viewProps,
			});
			return new LabelController(args.document, {
				blade: args.blade,
				props: new ValueMap({
					label: args.params.label,
				}),
				valueController: ic,
			});
		},
		api(controller) {
			if (!(controller instanceof LabelController)) {
				return null;
			}
			if (!(controller.valueController instanceof TextController)) {
				return null;
			}
			return new TextApi(controller);
		},
	};
})();
