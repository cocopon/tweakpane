import {Formatter} from './formatter';

/**
 * @hidden
 */
export function boolToString(value: boolean): string {
	return String(value);
}

/**
 * @hidden
 */
export class BooleanFormatter implements Formatter<boolean> {
	public format(value: boolean): string {
		return boolToString(value);
	}
}
