// @flow

import {Formatter} from './formatter';

export default class StringFormatter implements Formatter<string> {
	public format(value: string): string {
		return value;
	}
}
