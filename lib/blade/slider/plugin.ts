import {Formatter} from '../../common/converter/formatter';
import {numberToString, parseNumber} from '../../common/converter/number';
import {ValueMap} from '../../common/model/value-map';
import {createValue} from '../../common/model/values';
import {SliderTextController} from '../../common/number/controller/slider-text';
import {ParamsParser, ParamsParsers, parseParams} from '../../common/params';
import {getSuitableDraggingScale} from '../../common/util';
import {BladeParams} from '../common/api/types';
import {LabeledValueController} from '../label/controller/value-label';
import {BladePlugin} from '../plugin';
import {SliderApi} from './api/slider';

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
		const p = ParamsParsers;
		const result = parseParams<SliderBladeParams>(params, {
			max: p.required.number,
			min: p.required.number,
			view: p.required.constant('slider'),

			format: p.optional.function as ParamsParser<Formatter<number>>,
			label: p.optional.string,
			value: p.optional.number,
		});
		return result ? {params: result} : null;
	},
	controller(args) {
		const v = args.params.value ?? 0;
		const vc = new SliderTextController(args.document, {
			baseStep: 1,
			parser: parseNumber,
			sliderProps: ValueMap.fromObject({
				maxValue: args.params.max,
				minValue: args.params.min,
			}),
			textProps: ValueMap.fromObject({
				draggingScale: getSuitableDraggingScale(undefined, v),
				formatter: args.params.format ?? numberToString,
			}),
			value: createValue(v),
			viewProps: args.viewProps,
		});
		return new LabeledValueController<number, SliderTextController>(
			args.document,
			{
				blade: args.blade,
				props: ValueMap.fromObject({
					label: args.params.label,
				}),
				valueController: vc,
			},
		);
	},
	api(controller) {
		if (!(controller instanceof LabeledValueController)) {
			return null;
		}
		if (!(controller.valueController instanceof SliderTextController)) {
			return null;
		}
		return new SliderApi(controller);
	},
};
