/**
 * @hidden
 */
export function boolToString(value: boolean): string {
	return String(value);
}
/**
 * @hidden
 */
export function boolFromUnknown(value: unknown): boolean {
	if (value === 'false') {
		return false;
	}
	return !!value;
}

/**
 * @hidden
 */
export function BooleanFormatter(value: boolean): string {
	return boolToString(value);
}
