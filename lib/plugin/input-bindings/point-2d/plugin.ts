import {InputParams, PointDimensionParams} from '../../../api/types';
import {isEmpty} from '../../../misc/type-util';
import {CompositeConstraint} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {RangeConstraint} from '../../common/constraint/range';
import {StepConstraint} from '../../common/constraint/step';
import {ConstraintUtil} from '../../common/constraint/util';
import {Value} from '../../common/model/value';
import {PaneError} from '../../common/pane-error';
import {StringNumberParser} from '../../common/reader/string-number';
import {NumberFormatter} from '../../common/writer/number';
import {InputBindingPlugin} from '../../input-binding';
import {getBaseStep, getSuitableDecimalDigits} from '../../util';
import {Point2dConstraint} from './constraint/point-2d';
import {Point2dPadTextController} from './controller/point-2d-pad-text';
import {Point2d, Point2dObject} from './model/point-2d';
import {point2dFromUnknown} from './reader/point-2d';

function createDimensionConstraint(
	params: PointDimensionParams | undefined,
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

function shouldInvertY(params: InputParams): boolean {
	if (!('y' in params)) {
		return false;
	}

	const yParams = params.y;
	if (!yParams) {
		return false;
	}

	return 'inverted' in yParams ? !!yParams.inverted : false;
}

/**
 * @hidden
 */
export const Point2dInputPlugin: InputBindingPlugin<Point2d, Point2dObject> = {
	id: 'input-point2d',
	binding: {
		accept: (value, _params) => (Point2d.isObject(value) ? value : null),
		reader: (_args) => point2dFromUnknown,
		writer: (_args) => (v) => v.toObject(),
		constraint: (args) => createConstraint(args.params),
		equals: Point2d.equals,
	},
	controller: (args) => {
		return createController(
			args.document,
			args.binding.value,
			shouldInvertY(args.params),
		);
	},
};
