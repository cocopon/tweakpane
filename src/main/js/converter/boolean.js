// @flow

export function fromMixed(value: mixed): boolean {
	if (value === 'false') {
		return false;
	}
	return !!value;
}

export function toString(value: boolean): string {
	return String(value);
}
