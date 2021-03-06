import {InputParams, PointDimensionParams} from '../../../api/types';
import {isEmpty} from '../../../misc/type-util';
import {CompositeConstraint} from '../../common/constraint/composite';
import {Constraint} from '../../common/constraint/constraint';
import {RangeConstraint} from '../../common/constraint/range';
import {StepConstraint} from '../../common/constraint/step';
import {
	createNumberFormatter,
	parseNumber,
} from '../../common/converter/number';
import {Value} from '../../common/model/value';
import {TpError} from '../../common/tp-error';
import {InputBindingPlugin} from '../../input-binding';
import {
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
} from '../../util';
import {PointNdConstraint} from '../common/constraint/point-nd';
import {PointNdTextController} from '../common/controller/point-nd-text';
import {point3dFromUnknown, writePoint3d} from './converter/point-3d';
import {Point3d, Point3dAssembly, Point3dObject} from './model/point-3d';

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

function createConstraint(params: InputParams): Constraint<Point3d> {
	return new PointNdConstraint({
		assembly: Point3dAssembly,
		components: [
			createDimensionConstraint('x' in params ? params.x : undefined),
			createDimensionConstraint('y' in params ? params.y : undefined),
			createDimensionConstraint('z' in params ? params.z : undefined),
		],
	});
}

function createAxis(
	initialValue: number,
	constraint: Constraint<number> | undefined,
) {
	return {
		baseStep: getBaseStep(constraint),
		draggingScale: getSuitableDraggingScale(constraint, initialValue),
		formatter: createNumberFormatter(
			getSuitableDecimalDigits(constraint, initialValue),
		),
	};
}

function createController(document: Document, value: Value<Point3d>) {
	const c = value.constraint;
	if (!(c instanceof PointNdConstraint)) {
		throw TpError.shouldNeverHappen();
	}

	return new PointNdTextController(document, {
		assembly: Point3dAssembly,
		axes: [
			createAxis(value.rawValue.x, c.components[0]),
			createAxis(value.rawValue.y, c.components[1]),
			createAxis(value.rawValue.z, c.components[2]),
		],
		parser: parseNumber,
		value: value,
	});
}

/**
 * @hidden
 */
export const Point3dInputPlugin: InputBindingPlugin<Point3d, Point3dObject> = {
	id: 'input-point3d',
	accept: (value, _params) => (Point3d.isObject(value) ? value : null),
	binding: {
		reader: (_args) => point3dFromUnknown,
		constraint: (args) => createConstraint(args.params),
		equals: Point3d.equals,
		writer: (_args) => writePoint3d,
	},
	controller: (args) => {
		return createController(args.document, args.value);
	},
};
