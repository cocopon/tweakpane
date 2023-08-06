import {
	isMonitorBindingValue,
	MonitorBindingValue,
} from '../../../common/binding/value/monitor-binding.js';
import {ValueController} from '../../../common/controller/value.js';
import {BufferedValue, TpBuffer} from '../../../common/model/buffered-value.js';
import {View} from '../../../common/view/view.js';
import {BladeController} from '../../common/controller/blade.js';
import {
	BladeState,
	exportBladeState,
} from '../../common/controller/blade-state.js';
import {isValueBladeController} from '../../common/controller/value-blade.js';
import {BindingController} from './binding.js';

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
			binding: {
				readonly: true,
			},
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
