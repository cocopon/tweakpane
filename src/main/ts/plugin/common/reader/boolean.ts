/**
 * @hidden
 */
export function boolFromUnknown(value: unknown): boolean {
	if (value === 'false') {
		return false;
	}
	return !!value;
}
