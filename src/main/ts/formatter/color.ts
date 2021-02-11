import {Color} from '../model/color';
import {Formatter} from './formatter';

/**
 * @hidden
 */
export class ColorFormatter implements Formatter<Color> {
	private stringifier_: (color: Color) => string;

	constructor(stringifier: (color: Color) => string) {
		this.stringifier_ = stringifier;
	}

	public format(value: Color): string {
		return this.stringifier_(value);
	}
}
