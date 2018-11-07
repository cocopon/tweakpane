// @flow

import type {Formatter} from './formatter';

export default class NumberFormatter implements Formatter<number> {
	digits_: number;

	constructor(digits: number) {
		this.digits_ = digits;
	}

	get digits(): number {
		return this.digits_;
	}

	format(value: number): string {
		return value.toFixed(this.digits_);
	}
}
