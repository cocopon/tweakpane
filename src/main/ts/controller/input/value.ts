import {Value} from '../../model/value';
import {ViewModel} from '../../model/view-model';
import {ValueView} from '../../view/input/value';
import {View} from '../../view/view';

/**
 * @hidden
 */
export interface ValueController<T> {
	readonly value: Value<T>;
	readonly view: View & ValueView<T>;
	readonly viewModel: ViewModel;
}
