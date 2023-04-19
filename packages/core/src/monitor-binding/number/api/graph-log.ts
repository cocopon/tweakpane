import {BindingApi} from '../../../blade/binding/api/binding.js';
import {MonitorBindingApi} from '../../../blade/binding/api/monitor-binding.js';
import {MonitorBindingController} from '../../../blade/binding/controller/monitor-binding.js';
import {TpBuffer} from '../../../common/model/buffered-value.js';
import {GraphLogController} from '../controller/graph-log.js';

export class GraphLogMonitorBindingApi
	extends BindingApi<
		TpBuffer<number>,
		number,
		MonitorBindingController<number, GraphLogController>
	>
	implements MonitorBindingApi<number>
{
	get max(): number {
		return this.controller.valueController.props.get('max');
	}

	set max(max: number) {
		this.controller.valueController.props.set('max', max);
	}

	get min(): number {
		return this.controller.valueController.props.get('min');
	}

	set min(min: number) {
		this.controller.valueController.props.set('min', min);
	}
}
