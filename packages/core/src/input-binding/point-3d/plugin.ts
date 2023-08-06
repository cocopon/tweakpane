import {Point3dInputParams} from '../../blade/common/api/params.js';
import {Constraint} from '../../common/constraint/constraint.js';
import {parseNumber} from '../../common/converter/number.js';
import {parseRecord} from '../../common/micro-parsers.js';
import {createPointAxis} from '../../common/point-nd/point-axis.js';
import {
	createDimensionConstraint,
	createPointDimensionParser,
	parsePointDimensionParams,
} from '../../common/point-nd/util.js';
import {deepMerge} from '../../misc/type-util.js';
import {createPlugin} from '../../plugin/plugin.js';
import {PointNdConstraint} from '../common/constraint/point-nd.js';
import {PointNdTextController} from '../common/controller/point-nd-text.js';
import {InputBindingPlugin} from '../plugin.js';
import {point3dFromUnknown, writePoint3d} from './converter/point-3d.js';
import {Point3d, Point3dAssembly, Point3dObject} from './model/point-3d.js';

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
> = createPlugin({
	id: 'input-point3d',
	type: 'input',
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
					initialValue: comp,
					params: deepMerge(
						args.params,
						(dParams[i] ?? {}) as Record<string, unknown>,
					),
				}),
			),
			parser: parseNumber,
			value: value,
			viewProps: args.viewProps,
		});
	},
});
