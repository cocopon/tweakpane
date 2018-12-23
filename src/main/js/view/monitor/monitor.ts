import MonitorValue from '../../model/monitor-value';

export interface MonitorView<T> {
	readonly value: MonitorValue<T>;

	update(): void;
}
