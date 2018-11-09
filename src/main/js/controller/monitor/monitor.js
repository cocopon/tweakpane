// @flow

import MonitorValue from '../../model/monitor-value';
import View from '../../view/view';

import type {MonitorView} from '../../view/monitor/monitor';

export interface MonitorController<T> {
	+value: MonitorValue<T>;
	+view: View & MonitorView<T>;
}
