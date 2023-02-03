import {isObject} from '../../../misc/type-util';
import {Value} from '../../model/value';
import {Binding, isBinding} from '../binding';

export interface BindingValue<T> extends Value<T> {
	readonly binding: Binding;
	fetch(): void;
}

export function isBindingValue(v: unknown): v is BindingValue<unknown> {
	if (!isObject(v) || !('binding' in v)) {
		return false;
	}
	const b = (v as {binding: unknown}).binding;
	return isBinding(b);
}
