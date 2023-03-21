import {
	BaseBladeParams,
	BladePlugin,
	createSliderTextProps,
	createValue,
	DefiniteRangeConstraint,
	Formatter,
	getSuitablePointerScale,
	LabeledValueBladeController,
	LabelPropsObject,
	MicroParser,
	numberToString,
	parseNumber,
	parseRecord,
	SliderTextController,
	ValueMap,
	VERSION,
} from '@tweakpane/core';

import {SliderBladeApi} from './api/slider';

export interface SliderBladeParams extends BaseBladeParams {
	max: number;
	min: number;
	view: 'slider';

	format?: Formatter<number>;
	label?: string;
	value?: number;
}

export const SliderBladePlugin: BladePlugin<SliderBladeParams> = {
	id: 'slider',
	type: 'blade',
	core: VERSION,
	accept(params) {
		const result = parseRecord<SliderBladeParams>(params, (p) => ({
			max: p.required.number,
			min: p.required.number,
			view: p.required.constant('slider'),

			format: p.optional.function as MicroParser<Formatter<number>>,
			label: p.optional.string,
			value: p.optional.number,
		}));
		return result ? {params: result} : null;
	},
	controller(args) {
		const initialValue = args.params.value ?? 0;
		const drc = new DefiniteRangeConstraint({
			max: args.params.max,
			min: args.params.min,
		});
		const v = createValue(initialValue, {
			constraint: drc,
		});
		const vc = new SliderTextController(args.document, {
			...createSliderTextProps({
				formatter: args.params.format ?? numberToString,
				keyScale: createValue(1),
				max: drc.values.value('max'),
				min: drc.values.value('min'),
				pointerScale: getSuitablePointerScale(args.params, initialValue),
			}),
			parser: parseNumber,
			value: v,
			viewProps: args.viewProps,
		});
		return new LabeledValueBladeController<number, SliderTextController>(
			args.document,
			{
				blade: args.blade,
				props: ValueMap.fromObject<LabelPropsObject>({
					label: args.params.label,
				}),
				value: v,
				valueController: vc,
			},
		);
	},
	api(args) {
		if (!(args.controller instanceof LabeledValueBladeController)) {
			return null;
		}
		if (!(args.controller.valueController instanceof SliderTextController)) {
			return null;
		}
		return new SliderBladeApi(args.controller);
	},
};
