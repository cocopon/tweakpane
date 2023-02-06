import {MonitorBindingValue} from '../../../common/binding/value/monitor-binding';
import {ValueController} from '../../../common/controller/value';
import {TpBuffer} from '../../../common/model/buffered-value';
import {View} from '../../../common/view/view';
import {LabeledValueController} from '../../label/controller/value-label';

export type BufferedValueController<
	T,
	Vw extends View = View,
> = ValueController<TpBuffer<T>, Vw>;

export type MonitorBindingController<
	T,
	Vc extends BufferedValueController<T> = BufferedValueController<T>,
> = LabeledValueController<TpBuffer<T>, Vc, MonitorBindingValue<T>>;
