import {Value} from '../model/value';
import {View} from '../view/view';
import {Controller} from './controller';

export interface ValueController<T, V extends View> extends Controller<V> {
	readonly value: Value<T>;
}
