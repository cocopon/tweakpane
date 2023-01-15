import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {DefiniteRangeConstraint} from '../../common/constraint/definite-range';
import {ListConstraint} from '../../common/constraint/list';
import {RangeConstraint} from '../../common/constraint/range';
import {StepConstraint} from '../../common/constraint/step';
import {ListController} from '../../common/controller/list';
import {Formatter} from '../../common/converter/formatter';
import {
	createNumberFormatter,
	numberFromUnknown,
	parseNumber,
} from '../../common/converter/number';
import {ValueMap} from '../../common/model/value-map';
import {NumberTextController} from '../../common/number/controller/number-text';
import {SliderTextController} from '../../common/number/controller/slider-text';
import {BaseInputParams, ListParamsOptions} from '../../common/params';
import {
	ParamsParser,
	ParamsParsers,
	parseParams,
} from '../../common/params-parsers';
import {writePrimitive} from '../../common/primitive';
import {
	createListConstraint,
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
	parseListOptions,
} from '../../common/util';
import {isEmpty} from '../../misc/type-util';
import {InputBindingPlugin} from '../plugin';

export interface NumberInputParams extends BaseInputParams {
	format?: Formatter<number>;
	max?: number;
	min?: number;
	options?: ListParamsOptions<number>;
	step?: number;
}

/**
 * Tries to create a step constraint.
 * @param params The input parameters object.
 * @return A constraint or null if not found.
 */
export function createStepConstraint(
	params: {
		step?: number;
	},
	initialValue?: number,
): Constraint<number> | null {
	if ('step' in params && !isEmpty(params.step)) {
		return new StepConstraint(params.step, initialValue);
	}
	return null;
}

/**
 * Tries to create a range constraint.
 * @param params The input parameters object.
 * @return A constraint or null if not found.
 */
export function createRangeConstraint(params: {
	max?: number;
	min?: number;
}): Constraint<number> | null {
	if (!isEmpty(params.max) && !isEmpty(params.min)) {
		return new DefiniteRangeConstraint({
			max: params.max,
			min: params.min,
		});
	}
	if (!isEmpty(params.max) || !isEmpty(params.min)) {
		return new RangeConstraint({
			max: params.max,
			min: params.min,
		});
	}
	return null;
}

/**
 * Finds a range from number constraint.
 * @param c The number constraint.
 * @return A list that contains a minimum value and a max value.
 */
export function findNumberRange(
	c: Constraint<number>,
): [number | undefined, number | undefined] {
	const drc = findConstraint(c, DefiniteRangeConstraint);
	if (drc) {
		return [drc.values.get('min'), drc.values.get('max')];
	}
	const rc = findConstraint(c, RangeConstraint);
	if (rc) {
		return [rc.minValue, rc.maxValue];
	}
	return [undefined, undefined];
}

function createConstraint(
	params: NumberInputParams,
	// TODO: Make it required in the next version
	initialValue?: number,
): Constraint<number> {
	const constraints: Constraint<number>[] = [];

	const sc = createStepConstraint(params, initialValue);
	if (sc) {
		constraints.push(sc);
	}
	const rc = createRangeConstraint(params);
	if (rc) {
		constraints.push(rc);
	}
	const lc = createListConstraint<number>(params.options);
	if (lc) {
		constraints.push(lc);
	}

	return new CompositeConstraint(constraints);
}

/**
 * @hidden
 */
export const NumberInputPlugin: InputBindingPlugin<
	number,
	number,
	NumberInputParams
> = {
	id: 'input-number',
	type: 'input',
	accept: (value, params) => {
		if (typeof value !== 'number') {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams<NumberInputParams>(params, {
			format: p.optional.function as ParamsParser<Formatter<number>>,
			max: p.optional.number,
			min: p.optional.number,
			options: p.optional.custom<ListParamsOptions<number>>(parseListOptions),
			step: p.optional.number,
		});
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (_args) => numberFromUnknown,
		constraint: (args) => createConstraint(args.params, args.initialValue),
		writer: (_args) => writePrimitive,
	},
	controller: (args) => {
		const value = args.value;
		const c = args.constraint;

		const lc = c && findConstraint<ListConstraint<number>>(c, ListConstraint);
		if (lc) {
			return new ListController(args.document, {
				props: new ValueMap({
					options: lc.values.value('options'),
				}),
				value: value,
				viewProps: args.viewProps,
			});
		}

		const formatter =
			('format' in args.params ? args.params.format : undefined) ??
			createNumberFormatter(getSuitableDecimalDigits(c, value.rawValue));

		const drc = c && findConstraint(c, DefiniteRangeConstraint);
		if (drc) {
			return new SliderTextController(args.document, {
				baseStep: getBaseStep(c),
				parser: parseNumber,
				sliderProps: new ValueMap({
					maxValue: drc.values.value('max'),
					minValue: drc.values.value('min'),
				}),
				textProps: ValueMap.fromObject({
					draggingScale: getSuitableDraggingScale(c, value.rawValue),
					formatter: formatter,
				}),
				value: value,
				viewProps: args.viewProps,
			});
		}

		return new NumberTextController(args.document, {
			baseStep: getBaseStep(c),
			parser: parseNumber,
			props: ValueMap.fromObject({
				draggingScale: getSuitableDraggingScale(c, value.rawValue),
				formatter: formatter,
			}),
			value: value,
			viewProps: args.viewProps,
		});
	},
};
