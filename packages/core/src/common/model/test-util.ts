import {BindingValue} from './binding-value';
import {Value} from './value';

export function getBoundValue<T>(v: BindingValue<T>): Value<T> {
	return (v as any).value_;
}
