import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {View} from '../../../common/view/view';
import {Blade} from '../model/blade';
import {BladeController} from './blade';

/**
 * @hidden
 */
interface Config<T, Vw extends View, Va extends Value<T>> {
	blade: Blade;
	value: Va;
	view: Vw;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ValueBladeController<
	T,
	Vw extends View = View,
	Va extends Value<T> = Value<T>,
> extends BladeController<Vw> {
	public readonly value: Va;

	constructor(config: Config<T, Vw, Va>) {
		super(config);

		this.value = config.value;
	}
}

export function isValueBladeController(
	bc: BladeController,
): bc is ValueBladeController<unknown> {
	return 'value' in bc;
}
