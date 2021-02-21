import {isEmpty} from '../../../misc/type-util';
import {StringNumberParser} from './string-number';

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
