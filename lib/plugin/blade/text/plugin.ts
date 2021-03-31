import {BladeParams} from '../../../api/types';
import {forceCast} from '../../../misc/type-util';
import {BladePlugin} from '../../blade';
import {Formatter} from '../../common/converter/formatter';
import {Parser} from '../../common/converter/parser';
import {PrimitiveValue} from '../../common/model/primitive-value';
import {ValueMap} from '../../common/model/value-map';
import {
	findBooleanParam,
	findFunctionParam,
	findStringParam,
} from '../../common/params';
import {TextController} from '../../input-bindings/common/controller/text';
import {LabeledController} from '../labeled/controller';
import {TextBladeApi} from './api/text';

export interface TextParams<T> extends BladeParams {
	parse: Parser<T>;
	value: T;
	view: 'text';

	format?: Formatter<T>;
	label?: string;
}

function createParams<T>(
	params: Record<string, unknown>,
): TextParams<T> | null {
	if (findStringParam(params, 'view') !== 'text') {
		return null;
	}

	return {
		disabled: findBooleanParam(params, 'disabled'),
		format: forceCast(findFunctionParam(params, 'format')),
		label: findStringParam(params, 'label'),
		parse: forceCast(findFunctionParam(params, 'parse')),
		value: forceCast(params['value']),
		view: 'text',
	};
}

export const TextBladePlugin = (function<T>(): BladePlugin<TextParams<T>> {
	return {
		id: 'text',
		accept(params) {
			const p = createParams<T>(params);
			return p ? {params: p} : null;
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
				valueController: ic,
				label: args.params.label,
			});
			return new TextBladeApi(c);
		},
	};
})();
