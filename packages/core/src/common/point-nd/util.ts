import {isRecord} from '../../misc/type-util.js';
import {CompositeConstraint} from '../constraint/composite.js';
import {Constraint} from '../constraint/constraint.js';
import {MicroParsers, parseRecord} from '../micro-parsers.js';
import {
	createNumberTextInputParamsParser,
	createRangeConstraint,
	createStepConstraint,
} from '../number/util.js';
import {PointDimensionParams} from '../params.js';

export function createPointDimensionParser(p: typeof MicroParsers) {
	return createNumberTextInputParamsParser(p);
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
