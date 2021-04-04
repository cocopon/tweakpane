import {InputParams, PointDimensionParams} from '../../blade/common/api/types';
import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {RangeConstraint} from '../../common/constraint/range';
import {StepConstraint} from '../../common/constraint/step';
import {
	createNumberFormatter,
	parseNumber,
} from '../../common/converter/number';
import {ValueMap} from '../../common/model/value-map';
import {TpError} from '../../common/tp-error';
import {
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
} from '../../common/util';
import {isEmpty} from '../../misc/type-util';
import {PointNdConstraint} from '../common/constraint/point-nd';
import {InputBindingPlugin} from '../plugin';
import {Point2dPadTextController} from './controller/point-2d-pad-text';
import {point2dFromUnknown, writePoint2d} from './converter/point-2d';
import {Point2d, Point2dAssembly, Point2dObject} from './model/point-2d';

function createDimensionConstraint(
	params: PointDimensionParams | undefined,
): Constraint<number> | undefined {
	if (!params) {
		return undefined;
	}

	const constraints: Constraint<number>[] = [];

	if (!isEmpty(params.step)) {
		constraints.push(new StepConstraint(params.step));
	}
	if (!isEmpty(params.max) || !isEmpty(params.min)) {
		constraints.push(
			new RangeConstraint({
				max: params.max,
				min: params.min,
			}),
		);
	}
	return new CompositeConstraint(constraints);
}

function createConstraint(params: InputParams): Constraint<Point2d> {
	return new PointNdConstraint({
		assembly: Point2dAssembly,
		components: [
			createDimensionConstraint('x' in params ? params.x : undefined),
			createDimensionConstraint('y' in params ? params.y : undefined),
		],
	});
}

function getSuitableMaxDimensionValue(
	constraint: Constraint<number> | undefined,
	rawValue: number,
): number {
	const rc = constraint && findConstraint(constraint, RangeConstraint);
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
		constraint instanceof PointNdConstraint
			? constraint.components[0]
			: undefined;
	const yc =
		constraint instanceof PointNdConstraint
			? constraint.components[1]
			: undefined;
	const xr = getSuitableMaxDimensionValue(xc, initialValue.x);
	const yr = getSuitableMaxDimensionValue(yc, initialValue.y);
	return Math.max(xr, yr);
}

function createAxis(
	initialValue: number,
	constraint: Constraint<number> | undefined,
) {
	return {
		baseStep: getBaseStep(constraint),
		constraint: constraint,
		textProps: new ValueMap({
			draggingScale: getSuitableDraggingScale(constraint, initialValue),
			formatter: createNumberFormatter(
				getSuitableDecimalDigits(constraint, initialValue),
			),
		}),
	};
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
	accept: (value, _params) => (Point2d.isObject(value) ? value : null),
	binding: {
		reader: (_args) => point2dFromUnknown,
		constraint: (args) => createConstraint(args.params),
		equals: Point2d.equals,
		writer: (_args) => writePoint2d,
	},
	controller: (args) => {
		const doc = args.document;
		const value = args.value;
		const c = args.constraint;
		if (!(c instanceof PointNdConstraint)) {
			throw TpError.shouldNeverHappen();
		}

		return new Point2dPadTextController(doc, {
			axes: [
				createAxis(value.rawValue.x, c.components[0]),
				createAxis(value.rawValue.y, c.components[1]),
			],
			invertsY: shouldInvertY(args.params),
			maxValue: getSuitableMaxValue(value.rawValue, c),
			parser: parseNumber,
			value: value,
			viewProps: args.viewProps,
		});
	},
};
