import MonitorValue from '../../model/monitor-value';
import View from '../../view/view';

import {MonitorView} from '../../view/monitor/monitor';

/**
 * @hidden
 */
export interface MonitorController<T> {
	readonly value: MonitorValue<T>;
	readonly view: View & MonitorView<T>;

	dispose(): void;
}
