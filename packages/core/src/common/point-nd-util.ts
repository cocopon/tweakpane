import {isRecord} from '../misc/type-util';
import {parseRecord} from './micro-parsers';
import {PointDimensionParams} from './params';

export function parsePointDimensionParams(
	value: unknown,
): PointDimensionParams | undefined {
	if (!isRecord(value)) {
		return undefined;
	}
	return parseRecord(value, (p) => ({
		max: p.optional.number,
		min: p.optional.number,
		step: p.optional.number,
	}));
}
