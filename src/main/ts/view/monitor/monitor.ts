import {BufferedValue} from '../../model/buffered-value';

/**
 * @hidden
 */
export interface MonitorView<T> {
	readonly value: BufferedValue<T>;

	update(): void;
}
