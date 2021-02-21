import {InputParams, Point2dDimensionParams} from '../../../api/types';
import {isEmpty} from '../../../misc/type-util';
import {CompositeConstraint} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {Point2dConstraint} from '../../common/constraint/point-2d';
import {RangeConstraint} from '../../common/constraint/range';
import {StepConstraint} from '../../common/constraint/step';
import {ConstraintUtil} from '../../common/constraint/util';
import {NumberFormatter} from '../../common/formatter/number';
import {Point2d, Point2dObject} from '../../common/model/point-2d';
import {Value} from '../../common/model/value';
import {ViewModel} from '../../common/model/view-model';
import {PaneError} from '../../common/pane-error';
import {point2dFromUnknown} from '../../common/parser/point-2d';
import {StringNumberParser} from '../../common/parser/string-number';
import {InputBindingPlugin} from '../../input-binding';
import {getBaseStep, getSuitableDecimalDigits} from '../../util';
import {Point2dPadTextController} from './controller/point-2d-pad-text';

function createDimensionConstraint(
	params: Point2dDimensionParams | undefined,
): Constraint<number> | undefined {
	if (!params) {
		return undefined;
	}

	const constraints: Constraint<number>[] = [];

	if (!isEmpty(params.step)) {
		constraints.push(
			new StepConstraint({
				step: params.step,
			}),
		);
	}
	if (!isEmpty(params.max) || !isEmpty(params.min)) {
		constraints.push(
			new RangeConstraint({
				max: params.max,
				min: params.min,
			}),
		);
	}
	return new CompositeConstraint({
		constraints: constraints,
	});
}

function createConstraint(params: InputParams): Constraint<Point2d> {
	return new Point2dConstraint({
		x: createDimensionConstraint('x' in params ? params.x : undefined),
		y: createDimensionConstraint('y' in params ? params.y : undefined),
	});
}

function getSuitableMaxDimensionValue(
	constraint: Constraint<number> | undefined,
	rawValue: number,
): number {
	const rc =
		constraint && ConstraintUtil.findConstraint(constraint, RangeConstraint);
	if (rc) {
		return Math.max(Math.abs(rc.minValue || 0), Math.abs(rc.maxValue || 0));
	}

	const step = getBaseStep(constraint);
	return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
}

/**
 * @hidden
 */
export function getSuitableMaxValue(
	initialValue: Point2d,
	constraint: Constraint<Point2d> | undefined,
): number {
	const xc =
		constraint instanceof Point2dConstraint
			? constraint.xConstraint
			: undefined;
	const yc =
		constraint instanceof Point2dConstraint
			? constraint.yConstraint
			: undefined;
	const xr = getSuitableMaxDimensionValue(xc, initialValue.x);
	const yr = getSuitableMaxDimensionValue(yc, initialValue.y);
	return Math.max(xr, yr);
}

function createController(
	document: Document,
	value: Value<Point2d>,
	invertsY: boolean,
) {
	const c = value.constraint;
	if (!(c instanceof Point2dConstraint)) {
		throw PaneError.shouldNeverHappen();
	}

	return new Point2dPadTextController(document, {
		invertsY: invertsY,
		maxValue: getSuitableMaxValue(value.rawValue, value.constraint),
		parser: StringNumberParser,
		value: value,
		viewModel: new ViewModel(),
		xBaseStep: getBaseStep(c.xConstraint),
		xFormatter: new NumberFormatter(
			getSuitableDecimalDigits(c.xConstraint, value.rawValue.x),
		),
		yBaseStep: getBaseStep(c.yConstraint),
		yFormatter: new NumberFormatter(
			getSuitableDecimalDigits(c.yConstraint, value.rawValue.y),
		),
	});
}

/**
 * @hidden
 */
export const Point2dInputPlugin: InputBindingPlugin<Point2d, Point2dObject> = {
	id: 'input-point2d',
	model: {
		accept: (value, _params) => (Point2d.isObject(value) ? value : null),
		reader: (_args) => point2dFromUnknown,
		writer: (_args) => (v) => v.toObject(),
		constraint: (args) => createConstraint(args.params),
		equals: Point2d.equals,
	},
	controller: (args) => {
		const yParams = 'y' in args.params ? args.params.y : undefined;
		const invertsY = yParams ? !!yParams.inverted : false;
		return createController(args.document, args.binding.value, invertsY);
	},
};
