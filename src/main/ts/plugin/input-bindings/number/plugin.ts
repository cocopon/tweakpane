import {InputParams} from '../../../api/types';
import {isEmpty} from '../../../misc/type-util';
import {CompositeConstraint} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {ListConstraint} from '../../common/constraint/list';
import {RangeConstraint} from '../../common/constraint/range';
import {StepConstraint} from '../../common/constraint/step';
import {ConstraintUtil} from '../../common/constraint/util';
import * as NumberConverter from '../../common/converter/number';
import {NumberFormatter} from '../../common/formatter/number';
import {Value} from '../../common/model/value';
import {ViewModel} from '../../common/model/view-model';
import {StringNumberParser} from '../../common/parser/string-number';
import {InputBindingPlugin} from '../../input-binding';
import {
	findListItems,
	getBaseStep,
	getSuitableDecimalDigits,
	normalizeInputParamsOptions,
} from '../../util';
import {ListController} from '../common/controller/list';
import {NumberTextController} from './controller/number-text';
import {SliderTextController} from './controller/slider-text';

function createConstraint(params: InputParams): Constraint<number> {
	const constraints: Constraint<number>[] = [];

	if ('step' in params && !isEmpty(params.step)) {
		constraints.push(
			new StepConstraint({
				step: params.step,
			}),
		);
	}

	if (
		('max' in params && !isEmpty(params.max)) ||
		('min' in params && !isEmpty(params.min))
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
export const NumberInputPlugin: InputBindingPlugin<number, number> = {
	id: 'input-number',
	model: {
		accept: (value) => (typeof value === 'number' ? value : null),
		constraint: (args) => createConstraint(args.params),
		reader: (_args) => NumberConverter.fromMixed,
		writer: (_args) => (v: number) => v,
	},
	controller: (args) => {
		return createController(args.document, args.binding.value);
	},
};
