export function boolToString(value: boolean): string {
	return String(value);
}

export function boolFromUnknown(value: unknown): boolean {
	if (value === 'false') {
		return false;
	}
	return !!value;
}

export function BooleanFormatter(value: boolean): string {
	return boolToString(value);
}
