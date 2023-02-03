import {Value} from '../model/value';
import {View} from '../view/view';
import {Controller} from './controller';

export interface ValueController<
	T,
	Vw extends View = View,
	Va extends Value<T> = Value<T>,
> extends Controller<Vw> {
	readonly value: Va;
}
