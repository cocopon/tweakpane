export type Class<T> = new (...args: any[]) => T;
export type Tuple3<T> = [T, T, T];
export type Tuple4<T> = [T, T, T, T];

export function forceCast<T>(v: any): T {
	return v;
}

export function isEmpty<T>(
	value: T | null | undefined,
): value is null | undefined {
	return value === null || value === undefined;
}

export function deepEqualsArray<T>(a1: T[], a2: T[]): boolean {
	if (a1.length !== a2.length) {
		return false;
	}

	for (let i = 0; i < a1.length; i++) {
		if (a1[i] !== a2[i]) {
			return false;
		}
	}
	return true;
}
