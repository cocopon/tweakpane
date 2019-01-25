import {Formatter} from './formatter';

/**
 * @hidden
 */
export default class NumberFormatter implements Formatter<number> {
	private digits_: number;

	constructor(digits: number) {
		this.digits_ = digits;
	}

	get digits(): number {
		return this.digits_;
	}

	public format(value: number): string {
		return value.toFixed(this.digits_);
	}
}
