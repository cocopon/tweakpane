import {BoundValue} from './bound-value';
import {Value} from './value';

export function getBoundValue<T>(v: BoundValue<T>): Value<T> {
	return (v as any).value_;
}
