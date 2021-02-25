import {Value} from '../model/value';
import {View} from './view';

/**
 * A view interface that has a value to bind.
 * @template T The type of the raw value.
 */
export interface ValueView<T> extends View {
	/**
	 * The value to bind to the view.
	 */
	readonly value: Value<T>;

	/**
	 * A method that should be called when the value changes.
	 */
	update(): void;
}
