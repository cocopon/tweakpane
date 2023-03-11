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
import {point4dFromUnknown, writePoint4d} from './converter/point-4d';
import {Point4d, Point4dAssembly, Point4dObject} from './model/point-4d';

export interface Point4dInputParams
	extends BaseInputParams,
		PointDimensionParams {
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
			createDimensionConstraint({...params, ...params.x}, initialValue.x),
			createDimensionConstraint({...params, ...params.y}, initialValue.y),
			createDimensionConstraint({...params, ...params.z}, initialValue.z),
			createDimensionConstraint({...params, ...params.w}, initialValue.w),
		],
	});
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
	core: VERSION,
	accept: (value, params) => {
		if (!Point4d.isObject(value)) {
			return null;
		}
		const result = parseRecord<Point4dInputParams>(params, (p) => ({
			...createPointDimensionParser(p),
			readonly: p.optional.constant(false),
			w: p.optional.custom(parsePointDimensionParams),
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
		reader: (_args) => point4dFromUnknown,
		constraint: (args) => createConstraint(args.params, args.initialValue),
		equals: Point4d.equals,
		writer: (_args) => writePoint4d,
	},
	controller: (args) => {
		const value = args.value;
		const c = args.constraint as PointNdConstraint<Point4d>;
		const dParams = [
			args.params.x,
			args.params.y,
			args.params.z,
			args.params.w,
		];
		return new PointNdTextController(args.document, {
			assembly: Point4dAssembly,
			axes: value.rawValue.getComponents().map((comp, i) =>
				createPointAxis({
					constraint: c.components[i],
					formatter: dParams[i]?.format ?? args.params.format,
					initialValue: comp,
				}),
			),
			parser: parseNumber,
			value: value,
			viewProps: args.viewProps,
		});
	},
};
