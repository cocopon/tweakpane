import {InputBindingValue} from '../binding/value/input-binding';
import {Value} from './value';

export function getBoundValue<T>(v: InputBindingValue<T>): Value<T> {
	return (v as any).value_;
}
