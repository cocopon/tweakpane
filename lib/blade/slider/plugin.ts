import {Formatter} from '../../common/converter/formatter';
import {numberToString, parseNumber} from '../../common/converter/number';
import {PrimitiveValue} from '../../common/model/primitive-value';
import {ValueMap} from '../../common/model/value-map';
import {SliderTextController} from '../../common/number/controller/slider-text';
import {
	findFunctionParam,
	findNumberParam,
	findStringParam,
} from '../../common/params';
import {getSuitableDraggingScale} from '../../common/util';
import {forceCast} from '../../misc/type-util';
import {BladeParams} from '../common/api/types';
import {LabeledController} from '../labeled/controller/labeled';
import {BladePlugin} from '../plugin';
import {SliderBladeApi} from './api/slider';

export interface SliderBladeParams extends BladeParams {
	max: number;
	min: number;
	view: 'slider';

	format?: Formatter<number>;
	label?: string;
	value?: number;
}

export const SliderBladePlugin: BladePlugin<SliderBladeParams> = {
	id: 'slider',
	accept(params) {
		if (findStringParam(params, 'view') !== 'slider') {
			return null;
		}
		const max = findNumberParam(params, 'max');
		const min = findNumberParam(params, 'min');
		if (max === undefined || min === undefined) {
			return null;
		}

		return {
			params: {
				format: forceCast(findFunctionParam(params, 'format')),
				label: findStringParam(params, 'label'),
				max: max,
				min: min,
				value: findNumberParam(params, 'value'),
				view: 'slider',
			},
		};
	},
	api(args) {
		const v = args.params.value ?? 0;
		const vc = new SliderTextController(args.document, {
			baseStep: 1,
			parser: parseNumber,
			sliderProps: new ValueMap({
				maxValue: args.params.max,
				minValue: args.params.min,
			}),
			textProps: new ValueMap({
				draggingScale: getSuitableDraggingScale(undefined, v),
				formatter: args.params.format ?? numberToString,
			}),
			value: new PrimitiveValue(v),
			viewProps: args.viewProps,
		});
		const c = new LabeledController(args.document, {
			blade: args.blade,
			props: new ValueMap({
				label: args.params.label,
			}),
			valueController: vc,
		});
		return new SliderBladeApi(c);
	},
};
