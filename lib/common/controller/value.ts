import {Value} from '../model/value';
import {View} from '../view/view';
import {Controller} from './controller';

/**
 * A controller that has a value to bind to a view.
 * @template T The type of the raw value.
 */
export interface ValueController<T> extends Controller {
	/**
	 * The value to bind to the view.
	 */
	readonly value: Value<T>;
	readonly view: View;
}
