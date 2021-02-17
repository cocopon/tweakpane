import {Value} from './value';

/**
 * @hidden
 */
export interface ValueBuffer<T> {
	values: T[];
	bufferSize: number;
}

// TODO: Remove
export type MonitorValue<T> = Value<ValueBuffer<T>>;
