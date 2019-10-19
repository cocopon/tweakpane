import {InputValue} from '../../model/input-value';
import {InputView} from '../../view/input/input';
import {View} from '../../view/view';

/**
 * @hidden
 */
export interface InputController<T> {
	readonly value: InputValue<T>;
	readonly view: View & InputView<T>;

	dispose(): void;
}
