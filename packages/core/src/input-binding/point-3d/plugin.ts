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
import {point3dFromUnknown, writePoint3d} from './converter/point-3d';
import {Point3d, Point3dAssembly, Point3dObject} from './model/point-3d';

export interface Point3dInputParams extends BaseInputParams {
	x?: PointDimensionParams;
	y?: PointDimensionParams;
	z?: PointDimensionParams;
}

function createConstraint(
	params: Point3dInputParams,
	initialValue: Point3dObject,
): Constraint<Point3d> {
	return new PointNdConstraint({
		assembly: Point3dAssembly,
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
export const Point3dInputPlugin: InputBindingPlugin<
	Point3d,
	Point3dObject,
	Point3dInputParams
> = {
	id: 'input-point3d',
	type: 'input',
	accept: (value, params) => {
		if (!Point3d.isObject(value)) {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams<Point3dInputParams>(params, {
			x: p.optional.custom(parsePointDimensionParams),
			y: p.optional.custom(parsePointDimensionParams),
			z: p.optional.custom(parsePointDimensionParams),
		});
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (_args) => point3dFromUnknown,
		constraint: (args) => createConstraint(args.params, args.initialValue),
		equals: Point3d.equals,
		writer: (_args) => writePoint3d,
	},
	controller: (args) => {
		const value = args.value;
		const c = args.constraint;
		if (!(c instanceof PointNdConstraint)) {
			throw TpError.shouldNeverHappen();
		}

		return new PointNdTextController(args.document, {
			assembly: Point3dAssembly,
			axes: [
				createAxis(value.rawValue.x, c.components[0]),
				createAxis(value.rawValue.y, c.components[1]),
				createAxis(value.rawValue.z, c.components[2]),
			],
			parser: parseNumber,
			value: value,
			viewProps: args.viewProps,
		});
	},
};
