import {BindingTarget} from './binding/target';

/**
 * The union of primitive types.
 */
export type Primitive = boolean | number | string;

/**
 * Compares two primitive values.
 * @param v1 The value.
 * @param v2 The another value.
 * @return true if equal, false otherwise.
 */
export function equalsPrimitive<T extends Primitive>(v1: T, v2: T): boolean {
	return v1 === v2;
}

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
