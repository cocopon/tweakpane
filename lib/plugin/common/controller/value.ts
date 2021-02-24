import {Value} from '../model/value';
import {ValueView} from '../view/value';
import {Controller} from './controller';

/**
 * @hidden
 */
export interface ValueController<T> extends Controller {
	readonly value: Value<T>;
	readonly view: ValueView<T>;
}
