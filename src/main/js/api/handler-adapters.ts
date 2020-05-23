import {Handler} from '../misc/emitter';

export type HandlerAdapter = (
	handler: Handler,
) => (_: unknown, value: unknown) => void;

export function nop(handler: Handler) {
	return (_: unknown) => {
		handler();
	};
}

export function value(handler: Handler) {
	return (_: unknown, value: unknown) => {
		handler(value);
	};
}
