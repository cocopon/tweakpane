// @flow

export type Class<T> = new (...args: any[]) => T;

const FlowUtil = {
	forceCast: <T>(v: any): T => {
		return v;
	},

	getOrDefault: <T>(value: T | null | undefined, defaultValue: T): T => {
		return value !== null && value !== undefined ? value : defaultValue;
	},

	ifNotEmpty: <T>(
		value: T | null,
		thenFn: (value: T) => void,
		elseFn?: () => void,
	): void => {
		if (value !== null && value !== undefined) {
			thenFn(value);
		} else if (elseFn) {
			elseFn();
		}
	},
};

export default FlowUtil;
