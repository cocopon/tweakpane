import {forceCast} from '../../misc/type-util';
import {Value} from './value';
import {createValue} from './values';

/**
 * @hidden
 */
export type Buffer<T> = (T | undefined)[];

/**
 * @hidden
 */
export type BufferedValue<T> = Value<Buffer<T>>;

function fillBuffer<T>(buffer: Buffer<T>, bufferSize: number) {
	while (buffer.length < bufferSize) {
		buffer.push(undefined);
	}
}

/**
 * @hidden
 */
export function initializeBuffer<T>(bufferSize: number): BufferedValue<T> {
	const buffer: Buffer<T> = [];
	fillBuffer(buffer, bufferSize);
	return createValue(buffer);
}

function createTrimmedBuffer<T>(buffer: Buffer<T>): T[] {
	const index = buffer.indexOf(undefined);
	return forceCast(index < 0 ? buffer : buffer.slice(0, index));
}

/**
 * @hidden
 */
export function createPushedBuffer<T>(
	buffer: Buffer<T>,
	newValue: T,
): Buffer<T> {
	const newBuffer = [...createTrimmedBuffer(buffer), newValue];

	if (newBuffer.length > buffer.length) {
		newBuffer.splice(0, newBuffer.length - buffer.length);
	} else {
		fillBuffer(newBuffer, buffer.length);
	}

	return newBuffer;
}
