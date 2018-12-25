import InputValue from '../../model/input-value';

export interface InputView<T> {
	readonly value: InputValue<T>;

	update(): void;
}
