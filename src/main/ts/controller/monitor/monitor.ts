import {MonitorValue} from '../../model/monitor-value';
import {ViewModel} from '../../model/view-model';
import {MonitorView} from '../../view/monitor/monitor';
import {View} from '../../view/view';

/**
 * @hidden
 */
export interface MonitorController<T> {
	readonly value: MonitorValue<T>;
	readonly view: View & MonitorView<T>;
	readonly viewModel: ViewModel;
}
