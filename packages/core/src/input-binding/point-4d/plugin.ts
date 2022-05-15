import {Constraint} from '../../common/constraint/constraint';
import {
	createNumberFormatter,
	parseNumber,
} from '../../common/converter/number';
import {ValueMap} from '../../common/model/value-map';
import {BaseInputParams, PointDimensionParams} from '../../common/params';
import {ParamsParsers, parseParams} from '../../common/params-parsers';
import {TpError} from '../../common/tp-error';
import {
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
	parsePointDimensionParams,
} from '../../common/util';
import {PointNdConstraint} from '../common/constraint/point-nd';
import {PointNdTextController} from '../common/controller/point-nd-text';
import {InputBindingPlugin} from '../plugin';
import {createDimensionConstraint} from '../point-2d/plugin';
import {point4dFromUnknown, writePoint4d} from './converter/point-4d';
import {Point4d, Point4dAssembly, Point4dObject} from './model/point-4d';

export interface Point4dInputParams extends BaseInputParams {
	x?: PointDimensionParams;
	y?: PointDimensionParams;
	z?: PointDimensionParams;
	w?: PointDimensionParams;
}

function createConstraint(
	params: Point4dInputParams,
	initialValue: Point4dObject,
): Constraint<Point4d> {
	return new PointNdConstraint({
		assembly: Point4dAssembly,
		components: [
			createDimensionConstraint(
				'x' in params ? params.x : undefined,
				initialValue.x,
			),
			createDimensionConstraint(
				'y' in params ? params.y : undefined,
				initialValue.y,
			),
			createDimensionConstraint(
				'z' in params ? params.z : undefined,
				initialValue.z,
			),
			createDimensionConstraint(
				'w' in params ? params.w : undefined,
				initialValue.w,
			),
		],
	});
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

/**
 * @hidden
 */
export const Point4dInputPlugin: InputBindingPlugin<
	Point4d,
	Point4dObject,
	Point4dInputParams
> = {
	id: 'input-point4d',
	type: 'input',
	accept: (value, params) => {
		if (!Point4d.isObject(value)) {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams<Point4dInputParams>(params, {
			x: p.optional.custom(parsePointDimensionParams),
			y: p.optional.custom(parsePointDimensionParams),
			z: p.optional.custom(parsePointDimensionParams),
			w: p.optional.custom(parsePointDimensionParams),
		});
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (_args) => point4dFromUnknown,
		constraint: (args) => createConstraint(args.params, args.initialValue),
		equals: Point4d.equals,
		writer: (_args) => writePoint4d,
	},
	controller: (args) => {
		const value = args.value;
		const c = args.constraint;
		if (!(c instanceof PointNdConstraint)) {
			throw TpError.shouldNeverHappen();
		}

		return new PointNdTextController(args.document, {
			assembly: Point4dAssembly,
			axes: value.rawValue
				.getComponents()
				.map((comp, index) => createAxis(comp, c.components[index])),
			parser: parseNumber,
			value: value,
			viewProps: args.viewProps,
		});
	},
};
