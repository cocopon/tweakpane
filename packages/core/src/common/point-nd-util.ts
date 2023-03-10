import {isRecord} from '../misc/type-util';
import {CompositeConstraint} from './constraint/composite';
import {Constraint} from './constraint/constraint';
import {createNumberFormatter} from './converter/number';
import {MicroParsers, parseRecord} from './micro-parsers';
import {ValueMap} from './model/value-map';
import {
	createRangeConstraint,
	createStepConstraint,
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
} from './number/util';
import {PointDimensionParams} from './params';
import {Axis} from './point-nd/axis';

export function createPointDimensionParser(p: typeof MicroParsers) {
	return {
		max: p.optional.number,
		min: p.optional.number,
		step: p.optional.number,
	};
}

export function parsePointDimensionParams(
	value: unknown,
): PointDimensionParams | undefined {
	if (!isRecord(value)) {
		return undefined;
	}
	return parseRecord(value, createPointDimensionParser);
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

export function createAxis(
	initialValue: number,
	constraint: Constraint<number> | undefined,
): Axis {
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
