type PropertyFinder<T> = (
	params: Record<string, unknown>,
	key: string,
) => T | undefined;

function createParamFinder<T>(
	test: (value: unknown) => value is T,
): PropertyFinder<T> {
	return (params, key) => {
		if (!(key in params)) {
			return;
		}
		const value = params[key];
		return test(value) ? value : undefined;
	};
}

export const findBooleanParam = createParamFinder<boolean>(
	(value): value is boolean => typeof value === 'boolean',
);

export const findNumberParam = createParamFinder<number>(
	(value): value is number => typeof value === 'number',
);

export const findStringParam = createParamFinder<string>(
	(value): value is string => typeof value === 'string',
);

function isObject(value: unknown): value is Record<string, unknown> {
	if (value === null) {
		return false;
	}
	return typeof value === 'object';
}

export const findObjectParam = createParamFinder<Record<string, unknown>>(
	isObject,
);
