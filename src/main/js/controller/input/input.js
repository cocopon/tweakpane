// @flow

import InputValue from '../../model/input-value';
import View from '../../view/view';

import type {InputView} from '../../view/input/input';

export interface InputController<T> {
	+value: InputValue<T>;
	+view: View & InputView<T>;
}
