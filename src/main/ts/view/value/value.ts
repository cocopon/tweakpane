import {Value} from '../../model/value';

/**
 * @hidden
 */
export interface ValueView<T> {
	readonly value: Value<T>;

	update(): void;
}
