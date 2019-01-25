import * as BooleanConverter from '../converter/boolean';
import {Formatter} from './formatter';

/**
 * @hidden
 */
export default class BooleanFormatter implements Formatter<boolean> {
	public format(value: boolean): string {
		return BooleanConverter.toString(value);
	}
}
