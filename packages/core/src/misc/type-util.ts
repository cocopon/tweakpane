export type Class<T> = new (...args: any[]) => T;
export type Tuple2<T> = [T, T];
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

export function isObject(value: unknown): value is object {
	return value !== null && typeof value === 'object';
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object';
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

export function isPropertyWritable(obj: unknown, key: string): boolean {
	let target = obj;
	do {
		const d = Object.getOwnPropertyDescriptor(target, key);
		if (d && (d.set !== undefined || d.writable === true)) {
			return true;
		}

		target = Object.getPrototypeOf(target);
	} while (target !== null);

	return false;
}

export function deepMerge(
	r1: Record<string, unknown>,
	r2: Record<string, unknown>,
): Record<string, unknown> {
	const keys = Array.from(
		new Set<string>([...Object.keys(r1), ...Object.keys(r2)]),
	);
	return keys.reduce((result, key) => {
		const v1 = r1[key];
		const v2 = r2[key];
		return isRecord(v1) && isRecord(v2)
			? {
					...result,
					[key]: deepMerge(v1, v2),
			  }
			: {
					...result,
					[key]: key in r2 ? v2 : v1,
			  };
	}, {});
}
