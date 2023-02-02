import {MonitorBindingValue} from '../../../common/binding/value/monitor-binding';
import {ValueController} from '../../../common/controller/value';
import {Buffer} from '../../../common/model/buffered-value';
import {LabeledValueController} from '../../label/controller/value-label';

export type MonitorBindingController<T> = LabeledValueController<
	Buffer<T>,
	ValueController<Buffer<T>>,
	MonitorBindingValue<T>
>;

export function isMonitorBindingController<T>(
	c: unknown,
): c is MonitorBindingController<T> {
	if (!(c instanceof LabeledValueController)) {
		return false;
	}
	if (!(c.value instanceof MonitorBindingValue)) {
		return false;
	}
	return true;
}
