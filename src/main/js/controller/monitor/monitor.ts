import {Disposable} from '../../model/disposable';
import {MonitorValue} from '../../model/monitor-value';
import {MonitorView} from '../../view/monitor/monitor';
import {View} from '../../view/view';

/**
 * @hidden
 */
export interface MonitorController<T> {
	readonly disposable: Disposable;
	readonly value: MonitorValue<T>;
	readonly view: View & MonitorView<T>;
}
