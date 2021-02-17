import {InputParams, Point2dDimensionParams} from '../../api/types';
import {CompositeConstraint} from '../../constraint/composite';
import {Constraint} from '../../constraint/constraint';
import {Point2dConstraint} from '../../constraint/point-2d';
import {RangeConstraint} from '../../constraint/range';
import {StepConstraint} from '../../constraint/step';
import {Point2dPadTextInputController} from '../../controller/input/point-2d-pad-text';
import * as UiUtil from '../../controller/ui-util';
import * as Point2dConverter from '../../converter/point-2d';
import {NumberFormatter} from '../../formatter/number';
import {PaneError} from '../../misc/pane-error';
import {TypeUtil} from '../../misc/type-util';
import {InputValue} from '../../model/input-value';
import {Point2d, Point2dObject} from '../../model/point-2d';
import {ViewModel} from '../../model/view-model';
import {StringNumberParser} from '../../parser/string-number';
import {InputBindingPlugin} from '../input-binding';

function createDimensionConstraint(
	params: Point2dDimensionParams | undefined,
): Constraint<number> | undefined {
	if (!params) {
		return undefined;
	}

	const constraints: Constraint<number>[] = [];

	if (!TypeUtil.isEmpty(params.step)) {
		constraints.push(
			new StepConstraint({
				step: params.step,
			}),
		);
	}
	if (!TypeUtil.isEmpty(params.max) || !TypeUtil.isEmpty(params.min)) {
		constraints.push(
			new RangeConstraint({
				max: params.max,
				min: params.min,
			}),
		);
	}
	return new CompositeConstraint({
		constraints: constraints,
	});
}

function createConstraint(params: InputParams): Constraint<Point2d> {
	return new Point2dConstraint({
		x: createDimensionConstraint('x' in params ? params.x : undefined),
		y: createDimensionConstraint('y' in params ? params.y : undefined),
	});
}

function createController(
	document: Document,
	value: InputValue<Point2d>,
	invertsY: boolean,
) {
	const c = value.constraint;
	if (!(c instanceof Point2dConstraint)) {
		throw PaneError.shouldNeverHappen();
	}

	return new Point2dPadTextInputController(document, {
		invertsY: invertsY,
		parser: StringNumberParser,
		value: value,
		viewModel: new ViewModel(),
		xBaseStep: UiUtil.getStepForTextInput(c.xConstraint),
		xFormatter: new NumberFormatter(
			UiUtil.getSuitableDecimalDigits(c.xConstraint, value.rawValue.x),
		),
		yBaseStep: UiUtil.getStepForTextInput(c.yConstraint),
		yFormatter: new NumberFormatter(
			UiUtil.getSuitableDecimalDigits(c.yConstraint, value.rawValue.y),
		),
	});
}

/**
 * @hidden
 */
export const Point2dInputPlugin: InputBindingPlugin<Point2d, Point2dObject> = {
	model: {
		accept: (value, _params) => (Point2d.isObject(value) ? value : null),
		reader: (_args) => Point2dConverter.fromMixed,
		writer: (_args) => (v) => v.toObject(),
		constraint: (args) => createConstraint(args.params),
		equals: Point2d.equals,
	},
	controller: (args) => {
		const yParams = 'y' in args.params ? args.params.y : undefined;
		const invertsY = yParams ? !!yParams.inverted : false;
		return createController(args.document, args.binding.value, invertsY);
	},
};
