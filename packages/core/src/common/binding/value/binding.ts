import {isObject} from '../../../misc/type-util';
import {Value} from '../../model/value';
import {BindingTarget} from '../target';

export interface BindingValue<T> extends Value<T> {
	readonly binding: {
		target: BindingTarget;
	};

	fetch(): void;
}

export function isBindingValue(v: unknown): v is BindingValue<unknown> {
	if (!isObject(v)) {
		return false;
	}
	if (!('binding' in v)) {
		return false;
	}
	const b = (v as {binding: unknown}).binding;
	if (!isObject(b)) {
		return false;
	}
	if (!('target' in b)) {
		return false;
	}
	return (b as {target: unknown}).target instanceof BindingTarget;
}
