import {isRecord} from '../misc/type-util';
import {CompositeConstraint} from './constraint/composite';
import {Constraint} from './constraint/constraint';
import {MicroParsers, parseRecord} from './micro-parsers';
import {createRangeConstraint, createStepConstraint} from './number/util';
import {PointDimensionParams} from './params';

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
