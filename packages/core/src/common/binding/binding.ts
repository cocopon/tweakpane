import {isObject} from '../../misc/type-util.js';
import {BindingTarget} from './target.js';

/**
 * Converts an external unknown value into the internal value.
 * @template In The type of the internal value.
 */
export interface BindingReader<In> {
	/**
	 * @param exValue The bound value.
	 * @return A converted value.
	 */
	(exValue: unknown): In;
}

/**
 * Writes the internal value to the bound target.
 * @template In The type of the internal value.
 */
export interface BindingWriter<In> {
	/**
	 * @param target The target to be written.
	 * @param inValue The value to write.
	 */
	(target: BindingTarget, inValue: In): void;
}

/**
 * @hidden
 */
export interface Binding {
	readonly target: BindingTarget;
}

export function isBinding(value: unknown): value is Binding {
	if (!isObject(value)) {
		return false;
	}
	return 'target' in value;
}
