import {Value} from '../../../common/model/value';
import {View} from '../../../common/view/view';
import {BladeController} from './blade';

/**
 * @hidden
 */
export interface ValueBladeController<
	T,
	Vw extends View = View,
	Va extends Value<T> = Value<T>,
> extends BladeController<Vw> {
	readonly value: Va;
}

export function isValueBladeController(
	bc: BladeController,
): bc is ValueBladeController<unknown> {
	return 'value' in bc;
}
