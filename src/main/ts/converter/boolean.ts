/**
 * @hidden
 */
export function fromMixed(value: unknown): boolean {
	if (value === 'false') {
		return false;
	}
	return !!value;
}

/**
 * @hidden
 */
export function toString(value: boolean): string {
	return String(value);
}
