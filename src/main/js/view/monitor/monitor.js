// @flow

import MonitorValue from '../../model/monitor-value';

export interface MonitorView<T> {
	+value: MonitorValue<T>;

	update(): void;
}
