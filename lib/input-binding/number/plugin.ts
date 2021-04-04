import {InputParams} from '../../blade/common/api/types';
import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {RangeConstraint} from '../../common/constraint/range';
import {StepConstraint} from '../../common/constraint/step';
import {ListController} from '../../common/controller/list';
import {
	createNumberFormatter,
	parseNumber,
} from '../../common/converter/number';
import {numberFromUnknown} from '../../common/converter/number';
import {ValueMap} from '../../common/model/value-map';
import {NumberTextController} from '../../common/number/controller/number-text';
import {SliderTextController} from '../../common/number/controller/slider-text';
import {writePrimitive} from '../../common/primitive';
import {
	createListConstraint,
	findListItems,
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
} from '../../common/util';
import {isEmpty} from '../../misc/type-util';
import {InputBindingPlugin} from '../plugin';

/**
 * Tries to create a step constraint.
 * @param params The input parameters object.
 * @return A constraint or null if not found.
 */
export function createStepConstraint(
	params: InputParams,
): Constraint<number> | null {
	if ('step' in params && !isEmpty(params.step)) {
		return new StepConstraint(params.step);
	}
	return null;
}

/**
 * Tries to create a range constraint.
 * @param params The input parameters object.
 * @return A constraint or null if not found.
 */
export function createRangeConstraint(
	params: InputParams,
): Constraint<number> | null {
	if (
		('max' in params && !isEmpty(params.max)) ||
		('min' in params && !isEmpty(params.min))
	) {
		return new RangeConstraint({
			max: params.max,
			min: params.min,
		});
	}
	return null;
}

function createConstraint(params: InputParams): Constraint<number> {
	const constraints: Constraint<number>[] = [];

	const sc = createStepConstraint(params);
	if (sc) {
		constraints.push(sc);
	}
	const rc = createRangeConstraint(params);
	if (rc) {
		constraints.push(rc);
	}
	const lc = createListConstraint<number>(params);
	if (lc) {
		constraints.push(lc);
	}

	return new CompositeConstraint(constraints);
}

function findRange(
	constraint: Constraint<number>,
): [number | undefined, number | undefined] {
	const c = constraint ? findConstraint(constraint, RangeConstraint) : null;
	if (!c) {
		return [undefined, undefined];
	}

	return [c.minValue, c.maxValue];
}

function estimateSuitableRange(
	constraint: Constraint<number>,
): [number, number] {
	const [min, max] = findRange(constraint);
	return [min ?? 0, max ?? 100];
}

/**
 * @hidden
 */
export const NumberInputPlugin: InputBindingPlugin<number, number> = {
	id: 'input-number',
	accept: (value) => (typeof value === 'number' ? value : null),
	binding: {
		reader: (_args) => numberFromUnknown,
		constraint: (args) => createConstraint(args.params),
		writer: (_args) => writePrimitive,
	},
	controller: (args) => {
		const value = args.value;
		const c = args.constraint;

		if (c && findConstraint(c, ListConstraint)) {
			return new ListController(args.document, {
				props: new ValueMap({
					options: findListItems(c) ?? [],
				}),
				value: value,
				viewProps: args.viewProps,
			});
		}

		const formatter =
			('format' in args.params ? args.params.format : undefined) ??
			createNumberFormatter(getSuitableDecimalDigits(c, value.rawValue));

		if (c && findConstraint(c, RangeConstraint)) {
			const [min, max] = estimateSuitableRange(c);
			return new SliderTextController(args.document, {
				baseStep: getBaseStep(c),
				parser: parseNumber,
				sliderProps: new ValueMap({
					maxValue: max,
					minValue: min,
				}),
				textProps: new ValueMap({
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
			props: new ValueMap({
				draggingScale: getSuitableDraggingScale(c, value.rawValue),
				formatter: formatter,
			}),
			value: value,
			viewProps: args.viewProps,
		});
	},
};
