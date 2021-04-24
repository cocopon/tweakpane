import {TextController} from '../../common/controller/text';
import {Formatter} from '../../common/converter/formatter';
import {Parser} from '../../common/converter/parser';
import {PrimitiveValue} from '../../common/model/primitive-value';
import {ValueMap} from '../../common/model/value-map';
import {ParamsParser, ParamsParsers, parseParams} from '../../common/params';
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
