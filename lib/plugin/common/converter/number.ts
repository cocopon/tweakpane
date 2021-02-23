import {isEmpty} from '../../../misc/type-util';
import {StringNumberParser} from '../reader/string-number';
import {Formatter} from './formatter';

/**
 * @hidden
 */
export function numberFromUnknown(value: unknown): number {
	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'string') {
		const pv = StringNumberParser(value);
		if (!isEmpty(pv)) {
			return pv;
		}
	}

	return 0;
}

/**
 * @hidden
 */
export function numberToString(value: number): string {
	return String(value);
}

/**
 * @hidden
 */
export class NumberFormatter implements Formatter<number> {
	private digits_: number;

	constructor(digits: number) {
		this.digits_ = digits;
	}

	get digits(): number {
		return this.digits_;
	}

	public format(value: number): string {
		return value.toFixed(Math.max(Math.min(this.digits_, 20), 0));
	}
}
