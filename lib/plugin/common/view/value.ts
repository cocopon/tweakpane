import {Value} from '../model/value';
import {View} from './view';

/**
 * @hidden
 */
export interface ValueView<T> extends View {
	readonly value: Value<T>;

	update(): void;
}
