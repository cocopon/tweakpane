import {TypeUtil} from '../misc/type-util';
import {Value} from './value';

type Buffer<T> = (T | undefined)[];

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
export function initializeBuffer<T>(
	initialValue: T,
	bufferSize: number,
): BufferedValue<T> {
	const buffer: Buffer<T> = [initialValue];
	fillBuffer(buffer, bufferSize);
	return new Value(buffer);
}

function createTrimmedBuffer<T>(buffer: Buffer<T>): T[] {
	const index = buffer.indexOf(undefined);
	return TypeUtil.forceCast(index < 0 ? buffer : buffer.slice(0, index));
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
