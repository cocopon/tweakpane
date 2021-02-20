import {isEmpty} from '../../../misc/type-util';
import {StringNumberParser} from '../parser/string-number';

/**
 * @hidden
 */
export function fromMixed(value: unknown): number {
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
export function toString(value: number): string {
	return String(value);
}
