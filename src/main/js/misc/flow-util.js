// @flow

const FlowUtil = {
	forceCast<T>(v: any): T {
		return v;
	},

	getOrDefault<T>(value: ?T, defaultValue: T): T {
		return value !== null && value !== undefined ? value : defaultValue;
	},

	ifNotEmpty<T>(value: ?T, thenFn: (T) => void, elseFn?: () => void): void {
		if (value !== null && value !== undefined) {
			thenFn(value);
		} else if (elseFn) {
			elseFn();
		}
	},
};

export default FlowUtil;
