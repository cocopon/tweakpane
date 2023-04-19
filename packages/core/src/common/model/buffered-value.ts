import {forceCast} from '../../misc/type-util.js';
import {Value, ValueEvents} from './value.js';

/**
 * A buffer. Prefixed to avoid conflicts with the Node.js built-in class.
 * @template T
 */
export type TpBuffer<T> = (T | undefined)[];
export type BufferedValue<T> = Value<TpBuffer<T>>;
export type BufferedValueEvents<T> = ValueEvents<TpBuffer<T>>;

function fillBuffer<T>(buffer: TpBuffer<T>, bufferSize: number) {
	while (buffer.length < bufferSize) {
		buffer.push(undefined);
	}
}

export function initializeBuffer<T>(bufferSize: number): TpBuffer<T> {
	const buffer: TpBuffer<T> = [];
	fillBuffer(buffer, bufferSize);
	return buffer;
}

function createTrimmedBuffer<T>(buffer: TpBuffer<T>): T[] {
	const index = buffer.indexOf(undefined);
	return forceCast(index < 0 ? buffer : buffer.slice(0, index));
}

export function createPushedBuffer<T>(
	buffer: TpBuffer<T>,
	newValue: T,
): TpBuffer<T> {
	const newBuffer = [...createTrimmedBuffer(buffer), newValue];

	if (newBuffer.length > buffer.length) {
		newBuffer.splice(0, newBuffer.length - buffer.length);
	} else {
		fillBuffer(newBuffer, buffer.length);
	}

	return newBuffer;
}
