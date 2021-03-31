import {BindingTarget} from './binding/target';

/**
 * The union of primitive types.
 */
export type Primitive = boolean | number | string;

/**
 * Writes the primitive value.
 * @param target The target to be written.
 * @param value The value to write.
 */
export function writePrimitive<T extends Primitive>(
	target: BindingTarget,
	value: T,
): void {
	target.write(value);
}
