import {InputValue} from './input-value';

/**
 * @hidden
 */
export interface MonitorBuffer<T> {
	values: T[];
	bufferSize: number;
}

// TODO: Remove
export type MonitorValue<T> = InputValue<MonitorBuffer<T>>;
