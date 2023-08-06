import {
	Point2dInputParams,
	Point2dYParams,
} from '../../blade/common/api/params.js';
import {Constraint} from '../../common/constraint/constraint.js';
import {parseNumber} from '../../common/converter/number.js';
import {parseRecord} from '../../common/micro-parsers.js';
import {getSuitableKeyScale} from '../../common/number/util.js';
import {NumberTextInputParams} from '../../common/params.js';
import {parsePickerLayout} from '../../common/picker-util.js';
import {createPointAxis, PointAxis} from '../../common/point-nd/point-axis.js';
import {createPointDimensionParser} from '../../common/point-nd/util.js';
import {parsePointDimensionParams} from '../../common/point-nd/util.js';
import {createDimensionConstraint} from '../../common/point-nd/util.js';
import {deepMerge, isEmpty, Tuple2} from '../../misc/type-util.js';
import {createPlugin} from '../../plugin/plugin.js';
import {PointNdConstraint} from '../common/constraint/point-nd.js';
import {InputBindingPlugin} from '../plugin.js';
import {Point2dController} from './controller/point-2d.js';
import {point2dFromUnknown, writePoint2d} from './converter/point-2d.js';
import {Point2d, Point2dAssembly, Point2dObject} from './model/point-2d.js';

function createConstraint(
	params: Point2dInputParams,
	initialValue: Point2dObject,
): Constraint<Point2d> {
	return new PointNdConstraint({
		assembly: Point2dAssembly,
		components: [
			createDimensionConstraint({...params, ...params.x}, initialValue.x),
			createDimensionConstraint({...params, ...params.y}, initialValue.y),
		],
	});
}

function getSuitableMaxDimensionValue(
	params: NumberTextInputParams,
	rawValue: number,
): number {
	if (!isEmpty(params.min) || !isEmpty(params.max)) {
		return Math.max(Math.abs(params.min ?? 0), Math.abs(params.max ?? 0));
	}

	const step = getSuitableKeyScale(params);
	return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
}

export function getSuitableMax(
	params: Point2dInputParams,
	initialValue: Point2d,
): number {
	const xr = getSuitableMaxDimensionValue(
		deepMerge(params, (params.x ?? {}) as Record<string, unknown>),
		initialValue.x,
	);
	const yr = getSuitableMaxDimensionValue(
		deepMerge(params, (params.y ?? {}) as Record<string, unknown>),
		initialValue.y,
	);
	return Math.max(xr, yr);
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
> = createPlugin({
	id: 'input-point2d',
	type: 'input',
	accept: (value, params) => {
		if (!Point2d.isObject(value)) {
			return null;
		}
		const result = parseRecord<Point2dInputParams>(params, (p) => ({
			...createPointDimensionParser(p),
			expanded: p.optional.boolean,
			picker: p.optional.custom(parsePickerLayout),
			readonly: p.optional.constant(false),
			x: p.optional.custom(parsePointDimensionParams),
			y: p.optional.object<Point2dYParams & Record<string, unknown>>({
				...createPointDimensionParser(p),
				inverted: p.optional.boolean,
			}),
		}));
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: () => point2dFromUnknown,
		constraint: (args) => createConstraint(args.params, args.initialValue),
		equals: Point2d.equals,
		writer: () => writePoint2d,
	},
	controller: (args) => {
		const doc = args.document;
		const value = args.value;
		const c = args.constraint as PointNdConstraint<Point2d>;
		const dParams = [args.params.x, args.params.y];
		return new Point2dController(doc, {
			axes: value.rawValue.getComponents().map((comp, i) =>
				createPointAxis({
					constraint: c.components[i],
					initialValue: comp,
					params: deepMerge(
						args.params,
						(dParams[i] ?? {}) as Record<string, unknown>,
					),
				}),
			) as Tuple2<PointAxis>,
			expanded: args.params.expanded ?? false,
			invertsY: shouldInvertY(args.params),
			max: getSuitableMax(args.params, value.rawValue),
			parser: parseNumber,
			pickerLayout: args.params.picker ?? 'popup',
			value: value,
			viewProps: args.viewProps,
		});
	},
});
