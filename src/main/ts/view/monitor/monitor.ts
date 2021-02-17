import {MonitorValue} from '../../model/monitor-buffer';

/**
 * @hidden
 */
// TODO: Remove
export interface MonitorView<T> {
	readonly value: MonitorValue<T>;

	update(): void;
}
