import {
	CompositeConstraint,
	findConstraint,
} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {RangeConstraint} from '../../common/constraint/range';
import {
	createNumberFormatter,
	parseNumber,
} from '../../common/converter/number';
import {ValueMap} from '../../common/model/value-map';
import {
	BaseInputParams,
	PickerLayout,
	PointDimensionParams,
} from '../../common/params';
import {ParamsParsers, parseParams} from '../../common/params-parsers';
import {TpError} from '../../common/tp-error';
import {
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
	parsePickerLayout,
	parsePointDimensionParams,
} from '../../common/util';
import {PointNdConstraint} from '../common/constraint/point-nd';
import {createRangeConstraint, createStepConstraint} from '../number/plugin';
import {InputBindingPlugin} from '../plugin';
import {Point2dController} from './controller/point-2d';
import {point2dFromUnknown, writePoint2d} from './converter/point-2d';
import {Point2d, Point2dAssembly, Point2dObject} from './model/point-2d';

interface Point2dYParams extends PointDimensionParams {
	inverted?: boolean;
}

export interface Point2dInputParams extends BaseInputParams {
	expanded?: boolean;
	picker?: PickerLayout;
	x?: PointDimensionParams;
	y?: Point2dYParams;
}

export function createDimensionConstraint(
	params: PointDimensionParams | undefined,
	initialValue: number,
): Constraint<number> | undefined {
	if (!params) {
		return undefined;
	}

	const constraints: Constraint<number>[] = [];
	const cs = createStepConstraint(params, initialValue);
	if (cs) {
		constraints.push(cs);
	}
	const rs = createRangeConstraint(params);
	if (rs) {
		constraints.push(rs);
	}
	return new CompositeConstraint(constraints);
}

function createConstraint(
	params: Point2dInputParams,
	initialValue: Point2dObject,
): Constraint<Point2d> {
	return new PointNdConstraint({
		assembly: Point2dAssembly,
		components: [
			createDimensionConstraint(
				'x' in params ? params.x : undefined,
				initialValue.x,
			),
			createDimensionConstraint(
				'y' in params ? params.y : undefined,
				initialValue.y,
			),
		],
	});
}

function getSuitableMaxDimensionValue(
	constraint: Constraint<number> | undefined,
	rawValue: number,
): number {
	const rc = constraint && findConstraint(constraint, RangeConstraint);
	if (rc) {
		return Math.max(Math.abs(rc.minValue ?? 0), Math.abs(rc.maxValue ?? 0));
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
		textProps: ValueMap.fromObject({
			draggingScale: getSuitableDraggingScale(constraint, initialValue),
			formatter: createNumberFormatter(
				getSuitableDecimalDigits(constraint, initialValue),
			),
		}),
	};
}

function shouldInvertY(params: Point2dInputParams): boolean {
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
export const Point2dInputPlugin: InputBindingPlugin<
	Point2d,
	Point2dObject,
	Point2dInputParams
> = {
	id: 'input-point2d',
	type: 'input',
	accept: (value, params) => {
		if (!Point2d.isObject(value)) {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams<Point2dInputParams>(params, {
			expanded: p.optional.boolean,
			picker: p.optional.custom(parsePickerLayout),
			x: p.optional.custom(parsePointDimensionParams),
			y: p.optional.object<Point2dYParams & Record<string, unknown>>({
				inverted: p.optional.boolean,
				max: p.optional.number,
				min: p.optional.number,
				step: p.optional.number,
			}),
		});
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (_args) => point2dFromUnknown,
		constraint: (args) => createConstraint(args.params, args.initialValue),
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

		const expanded =
			'expanded' in args.params ? args.params.expanded : undefined;
		const picker = 'picker' in args.params ? args.params.picker : undefined;
		return new Point2dController(doc, {
			axes: [
				createAxis(value.rawValue.x, c.components[0]),
				createAxis(value.rawValue.y, c.components[1]),
			],
			expanded: expanded ?? false,
			invertsY: shouldInvertY(args.params),
			maxValue: getSuitableMaxValue(value.rawValue, c),
			parser: parseNumber,
			pickerLayout: picker ?? 'popup',
			value: value,
			viewProps: args.viewProps,
		});
	},
};
