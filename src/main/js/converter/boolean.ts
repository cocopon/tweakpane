// @flow

export function fromMixed(value: unknown): boolean {
	if (value === 'false') {
		return false;
	}
	return !!value;
}

export function toString(value: boolean): string {
	return String(value);
}
