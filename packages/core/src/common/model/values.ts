import {Constraint} from '../constraint/constraint.js';
import {ComplexValue} from './complex-value.js';
import {PrimitiveValue} from './primitive-value.js';
import {ReadonlyPrimitiveValue} from './readonly-primitive-value.js';
import {ReadonlyValue, Value, ValueChangeOptions} from './value.js';

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
	return new ComplexValue(initialValue, config);
}

export type SetRawValue<T> = (
	rawValue: T,
	options?: ValueChangeOptions | undefined,
) => void;

export function createReadonlyValue<T>(
	value: Value<T>,
): [ReadonlyValue<T>, SetRawValue<T>] {
	return [
		new ReadonlyPrimitiveValue(value),
		(rawValue: T, options: ValueChangeOptions | undefined) => {
			value.setRawValue(rawValue, options);
		},
	];
}
