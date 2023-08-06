import {InputBindingValue} from '../binding/value/input-binding.js';
import {Value} from './value.js';

export function getBoundValue<T>(v: InputBindingValue<T>): Value<T> {
	return (v as any).value_;
}
