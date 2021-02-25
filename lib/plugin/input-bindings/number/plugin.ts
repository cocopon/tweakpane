import {InputParams} from '../../../api/types';
import {isEmpty} from '../../../misc/type-util';
import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {RangeConstraint} from '../../common/constraint/range';
import {StepConstraint} from '../../common/constraint/step';
import {
	createNumberFormatter,
	numberToString,
	parseNumber,
} from '../../common/converter/number';
import {numberFromUnknown} from '../../common/converter/number';
import {Value} from '../../common/model/value';
import {writePrimitive} from '../../common/writer/primitive';
import {InputBindingPlugin} from '../../input-binding';
import {
	createListConstraint,
	findListItems,
	getBaseStep,
	getSuitableDecimalDigits,
} from '../../util';
import {ListController} from '../common/controller/list';
import {NumberTextController} from './controller/number-text';
import {SliderTextController} from './controller/slider-text';

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
	const lc = createListConstraint(params, numberFromUnknown);
	if (lc) {
		constraints.push(lc);
	}

	return new CompositeConstraint(constraints);
}

function createController(doc: Document, value: Value<number>) {
	const c = value.constraint;

	if (c && findConstraint(c, ListConstraint)) {
		return new ListController(doc, {
			listItems: findListItems(c) ?? [],
			stringifyValue: numberToString,
			value: value,
		});
	}

	if (c && findConstraint(c, RangeConstraint)) {
		return new SliderTextController(doc, {
			baseStep: getBaseStep(c),
			formatter: createNumberFormatter(
				getSuitableDecimalDigits(value.constraint, value.rawValue),
			),
			parser: parseNumber,
			value: value,
		});
	}

	return new NumberTextController(doc, {
		baseStep: getBaseStep(c),
		formatter: createNumberFormatter(
			getSuitableDecimalDigits(value.constraint, value.rawValue),
		),
		parser: parseNumber,
		value: value,
	});
}

/**
 * @hidden
 */
export const NumberInputPlugin: InputBindingPlugin<number, number> = {
	id: 'input-number',
	binding: {
		accept: (value) => (typeof value === 'number' ? value : null),
		constraint: (args) => createConstraint(args.params),
		reader: (_args) => numberFromUnknown,
		writer: (_args) => writePrimitive,
	},
	controller: (args) => {
		return createController(args.document, args.value);
	},
};
