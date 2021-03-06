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
import {point4dFromUnknown, writePoint4d} from './converter/point-4d';
import {Point4d, Point4dAssembly, Point4dObject} from './model/point-4d';

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

function createConstraint(params: InputParams): Constraint<Point4d> {
	return new PointNdConstraint({
		assembly: Point4dAssembly,
		components: [
			createDimensionConstraint('x' in params ? params.x : undefined),
			createDimensionConstraint('y' in params ? params.y : undefined),
			createDimensionConstraint('z' in params ? params.z : undefined),
			createDimensionConstraint('w' in params ? params.w : undefined),
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

function createController(document: Document, value: Value<Point4d>) {
	const c = value.constraint;
	if (!(c instanceof PointNdConstraint)) {
		throw TpError.shouldNeverHappen();
	}

	return new PointNdTextController(document, {
		assembly: Point4dAssembly,
		axes: value.rawValue
			.getComponents()
			.map((comp, index) => createAxis(comp, c.components[index])),
		parser: parseNumber,
		value: value,
	});
}

/**
 * @hidden
 */
export const Point4dInputPlugin: InputBindingPlugin<Point4d, Point4dObject> = {
	id: 'input-point4d',
	accept: (value, _params) => (Point4d.isObject(value) ? value : null),
	binding: {
		reader: (_args) => point4dFromUnknown,
		constraint: (args) => createConstraint(args.params),
		equals: Point4d.equals,
		writer: (_args) => writePoint4d,
	},
	controller: (args) => {
		return createController(args.document, args.value);
	},
};
