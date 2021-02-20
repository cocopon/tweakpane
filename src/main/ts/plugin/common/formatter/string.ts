import {Formatter} from './formatter';

/**
 * @hidden
 */
export class StringFormatter implements Formatter<string> {
	public format(value: string): string {
		return value;
	}
}
