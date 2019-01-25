import MonitorValue from '../../model/monitor-value';

/**
 * @hidden
 */
export interface MonitorView<T> {
	readonly value: MonitorValue<T>;

	update(): void;
}
