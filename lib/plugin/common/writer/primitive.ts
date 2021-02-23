import {Target} from '../model/target';

export function writePrimitive<T extends boolean | number | string>(
	target: Target,
	value: T,
): void {
	target.write(value);
}
