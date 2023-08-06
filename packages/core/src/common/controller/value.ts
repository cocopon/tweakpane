import {Value} from '../model/value.js';
import {View} from '../view/view.js';
import {Controller} from './controller.js';

export interface ValueController<
	T,
	Vw extends View = View,
	Va extends Value<T> = Value<T>,
> extends Controller<Vw> {
	readonly value: Va;
}
