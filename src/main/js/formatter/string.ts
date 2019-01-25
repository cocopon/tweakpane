import {Formatter} from './formatter';

/**
 * @hidden
 */
export default class StringFormatter implements Formatter<string> {
	public format(value: string): string {
		return value;
	}
}
