import {TextController} from '../../common/controller/text';
import {Formatter} from '../../common/converter/formatter';
import {Parser} from '../../common/converter/parser';
import {ValueMap} from '../../common/model/value-map';
import {createValue} from '../../common/model/values';
import {
	ParamsParser,
	ParamsParsers,
	parseParams,
} from '../../common/params-parsers';
import {BladeParams} from '../common/api/params';
import {LabeledValueController} from '../label/controller/value-label';
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
			const p = ParamsParsers;
			const result = parseParams<TextBladeParams<T>>(params, {
				parse: p.required.function as ParamsParser<Parser<T>>,
				value: p.required.raw as ParamsParser<T>,
				view: p.required.constant('text'),

				format: p.optional.function as ParamsParser<Formatter<T>>,
				label: p.optional.string,
			});
			return result ? {params: result} : null;
		},
		controller(args) {
			const ic = new TextController(args.document, {
				parser: args.params.parse,
				props: ValueMap.fromObject({
					formatter: args.params.format ?? ((v: T) => String(v)),
				}),
				value: createValue(args.params.value),
				viewProps: args.viewProps,
			});
			return new LabeledValueController<T, TextController<T>>(args.document, {
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
			if (!(controller.valueController instanceof TextController)) {
				return null;
			}
			return new TextApi(controller);
		},
	};
})();
