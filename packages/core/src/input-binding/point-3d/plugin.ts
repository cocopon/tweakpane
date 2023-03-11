import {Constraint} from '../../common/constraint/constraint';
import {parseNumber} from '../../common/converter/number';
import {parseRecord} from '../../common/micro-parsers';
import {BaseInputParams, PointDimensionParams} from '../../common/params';
import {createPointAxis} from '../../common/point-nd/point-axis';
import {
	createDimensionConstraint,
	createPointDimensionParser,
	parsePointDimensionParams,
} from '../../common/point-nd/util';
import {VERSION} from '../../version';
import {PointNdConstraint} from '../common/constraint/point-nd';
import {PointNdTextController} from '../common/controller/point-nd-text';
import {InputBindingPlugin} from '../plugin';
import {point3dFromUnknown, writePoint3d} from './converter/point-3d';
import {Point3d, Point3dAssembly, Point3dObject} from './model/point-3d';

export interface Point3dInputParams
	extends BaseInputParams,
		PointDimensionParams {
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
			createDimensionConstraint({...params, ...params.x}, initialValue.x),
			createDimensionConstraint({...params, ...params.y}, initialValue.y),
			createDimensionConstraint({...params, ...params.z}, initialValue.z),
		],
	});
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
	core: VERSION,
	accept: (value, params) => {
		if (!Point3d.isObject(value)) {
			return null;
		}
		const result = parseRecord<Point3dInputParams>(params, (p) => ({
			...createPointDimensionParser(p),
			readonly: p.optional.constant(false),
			x: p.optional.custom(parsePointDimensionParams),
			y: p.optional.custom(parsePointDimensionParams),
			z: p.optional.custom(parsePointDimensionParams),
		}));
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
		const c = args.constraint as PointNdConstraint<Point3d>;
		const dParams = [args.params.x, args.params.y, args.params.z];
		return new PointNdTextController(args.document, {
			assembly: Point3dAssembly,
			axes: value.rawValue.getComponents().map((comp, i) =>
				createPointAxis({
					constraint: c.components[i],
					formatter: dParams[i]?.formatter ?? args.params.formatter,
					initialValue: comp,
				}),
			),
			parser: parseNumber,
			value: value,
			viewProps: args.viewProps,
		});
	},
};
