import {Formatter} from './formatter';
/**
 * @hidden
 */
export function stringFromUnknown(value: unknown): string {
	return String(value);
}

/**
 * @hidden
 */
export class StringFormatter implements Formatter<string> {
	public format(value: string): string {
		return value;
	}
}
