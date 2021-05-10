import {Constraint} from '../constraint/constraint';
import {BoundValue} from './bound-value';
import {PrimitiveValue} from './primitive-value';
import {Value} from './value';

interface Config<T> {
	constraint?: Constraint<T>;
	equals?: (v1: T, v2: T) => boolean;
}

export function createValue<T>(initialValue: T, config?: Config<T>): Value<T> {
	const constraint = config?.constraint;
	const equals = config?.equals;
	if (!constraint && !equals) {
		return new PrimitiveValue(initialValue);
	}
	return new BoundValue(initialValue, config);
}
