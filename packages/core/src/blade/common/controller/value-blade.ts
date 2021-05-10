import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {View} from '../../../common/view/view';
import {Blade} from '../model/blade';
import {BladeController} from './blade';

interface Config<T, V extends View> {
	blade: Blade;
	value: Value<T>;
	view: V;
	viewProps: ViewProps;
}

export class ValueBladeController<
	T,
	V extends View,
> extends BladeController<V> {
	public readonly value: Value<T>;

	constructor(config: Config<T, V>) {
		super(config);

		this.value = config.value;
	}
}
