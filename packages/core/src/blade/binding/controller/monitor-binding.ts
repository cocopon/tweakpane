import {
	isMonitorBindingValue,
	MonitorBindingValue,
} from '../../../common/binding/value/monitor-binding';
import {ValueController} from '../../../common/controller/value';
import {BufferedValue, TpBuffer} from '../../../common/model/buffered-value';
import {View} from '../../../common/view/view';
import {BladeController} from '../../common/controller/blade';
import {
	BladeState,
	exportBladeState,
} from '../../common/controller/blade-state';
import {isValueBladeController} from '../../common/controller/value-blade';
import {BindingController} from './binding';

export type BufferedValueController<
	T,
	Vw extends View = View,
> = ValueController<TpBuffer<T>, Vw>;

/**
 * @hidden
 */
export class MonitorBindingController<
	T = unknown,
	Vc extends BufferedValueController<T> = BufferedValueController<T>,
> extends BindingController<TpBuffer<T>, Vc, MonitorBindingValue<T>> {
	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			readonly: true,
		});
	}
}

export function isMonitorBindingController(
	bc: BladeController,
): bc is MonitorBindingController {
	return (
		isValueBladeController(bc) &&
		isMonitorBindingValue(bc.value as BufferedValue<unknown>)
	);
}
