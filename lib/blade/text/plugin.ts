import {TextController} from '../../common/controller/text';
import {Formatter} from '../../common/converter/formatter';
import {Parser} from '../../common/converter/parser';
import {PrimitiveValue} from '../../common/model/primitive-value';
import {ValueMap} from '../../common/model/value-map';
import {findFunctionParam, findStringParam} from '../../common/params';
import {forceCast} from '../../misc/type-util';
import {BladeParams} from '../common/api/types';
import {LabeledController} from '../labeled/controller/labeled';
import {BladePlugin} from '../plugin';
import {TextBladeApi} from './api/text';

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
		api(args) {
			const ic = new TextController(args.document, {
				parser: args.params.parse,
				props: new ValueMap({
					formatter: args.params.format ?? ((v: T) => String(v)),
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
			return new TextBladeApi(c);
		},
	};
})();
