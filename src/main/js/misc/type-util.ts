export type Class<T> = new (...args: any[]) => T;

const TypeUtil = {
	forceCast: <T>(v: any): T => {
		return v;
	},

	isEmpty: <T>(value: T | null | undefined): value is null | undefined => {
		return value === null || value === undefined;
	},

	getOrDefault: <T>(value: T | null | undefined, defaultValue: T): T => {
		return !TypeUtil.isEmpty(value) ? value : defaultValue;
	},
};

export default TypeUtil;
