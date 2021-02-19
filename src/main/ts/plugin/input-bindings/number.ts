import {InputParams} from '../../api/types';
import {CompositeConstraint} from '../../constraint/composite';
import {Constraint} from '../../constraint/constraint';
import {ListConstraint} from '../../constraint/list';
import {RangeConstraint} from '../../constraint/range';
import {StepConstraint} from '../../constraint/step';
import {ConstraintUtil} from '../../constraint/util';
import {ListController} from '../../controller/value/list';
import {NumberTextController} from '../../controller/value/number-text';
import {SliderTextController} from '../../controller/value/slider-text';
import * as NumberConverter from '../../converter/number';
import {NumberFormatter} from '../../formatter/number';
import {TypeUtil} from '../../misc/type-util';
import {Value} from '../../model/value';
import {ViewModel} from '../../model/view-model';
import {StringNumberParser} from '../../parser/string-number';
import {RawInputBindingPlugin} from '../input-binding';
import {
	findListItems,
	getBaseStep,
	getSuitableDecimalDigits,
	normalizeInputParamsOptions,
} from '../util';

function createConstraint(params: InputParams): Constraint<number> {
	const constraints: Constraint<number>[] = [];

	if ('step' in params && !TypeUtil.isEmpty(params.step)) {
		constraints.push(
			new StepConstraint({
				step: params.step,
			}),
		);
	}

	if (
		('max' in params && !TypeUtil.isEmpty(params.max)) ||
		('min' in params && !TypeUtil.isEmpty(params.min))
	) {
		constraints.push(
			new RangeConstraint({
				max: params.max,
				min: params.min,
			}),
		);
	}

	if ('options' in params && params.options !== undefined) {
		constraints.push(
			new ListConstraint({
				options: normalizeInputParamsOptions(
					params.options,
					NumberConverter.fromMixed,
				),
			}),
		);
	}

	return new CompositeConstraint({
		constraints: constraints,
	});
}

function createController(document: Document, value: Value<number>) {
	const c = value.constraint;

	if (c && ConstraintUtil.findConstraint(c, ListConstraint)) {
		return new ListController(document, {
			listItems: findListItems(c) ?? [],
			stringifyValue: NumberConverter.toString,
			value: value,
			viewModel: new ViewModel(),
		});
	}

	if (c && ConstraintUtil.findConstraint(c, RangeConstraint)) {
		return new SliderTextController(document, {
			baseStep: getBaseStep(c),
			formatter: new NumberFormatter(
				getSuitableDecimalDigits(value.constraint, value.rawValue),
			),
			parser: StringNumberParser,
			value: value,
			viewModel: new ViewModel(),
		});
	}

	return new NumberTextController(document, {
		baseStep: getBaseStep(c),
		formatter: new NumberFormatter(
			getSuitableDecimalDigits(value.constraint, value.rawValue),
		),
		parser: StringNumberParser,
		value: value,
		viewModel: new ViewModel(),
	});
}

/**
 * @hidden
 */
export const NumberInputPlugin: RawInputBindingPlugin<number> = {
	id: 'input-number',
	model: {
		accept: (value) => (typeof value === 'number' ? value : null),
		constraint: (args) => createConstraint(args.params),
	},
	controller: (args) => {
		return createController(args.document, args.binding.value);
	},
};
