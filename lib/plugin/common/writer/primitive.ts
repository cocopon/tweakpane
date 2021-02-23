import {BindingTarget} from '../binding/target';

export function writePrimitive<T extends boolean | number | string>(
	target: BindingTarget,
	value: T,
): void {
	target.write(value);
}
