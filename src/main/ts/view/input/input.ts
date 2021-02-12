import {InputValue} from '../../model/input-value';

/**
 * @hidden
 */
export interface InputView<T> {
	readonly value: InputValue<T>;

	update(): void;
}
