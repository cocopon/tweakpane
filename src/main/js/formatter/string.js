// @flow

import type {Formatter} from './formatter';

export default class StringFormatter implements Formatter<string> {
	format(value: string): string {
		return value;
	}
}
