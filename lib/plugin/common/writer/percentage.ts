import {Formatter} from './formatter';
import {NumberFormatter} from './number';

const innerFormatter = new NumberFormatter(0);

/**
 * @hidden
 */
export class PercentageFormatter implements Formatter<number> {
	public format(value: number): string {
		return innerFormatter.format(value) + '%';
	}
}
