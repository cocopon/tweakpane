// @flow

import InputValue from '../../model/input-value';

export interface InputView<T> {
	+value: InputValue<T>;

	update(): void;
}
