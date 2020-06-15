import {NumberUtil} from '../misc/number-util';
import {TypeUtil} from '../misc/type-util';
import {Color} from '../model/color';
import {Formatter} from './formatter';

/**
 * @hidden
 */
export class ColorFormatter implements Formatter<Color> {
	public static rgb(r: number, g: number, b: number, a?: number): string {
		const comps = [
			NumberUtil.constrain(Math.floor(r), 0, 255),
			NumberUtil.constrain(Math.floor(g), 0, 255),
			NumberUtil.constrain(Math.floor(b), 0, 255),
		];
		if (!TypeUtil.isEmpty(a)) {
			comps.push(NumberUtil.constrain(a, 0, 1));
		}
		const funcName = TypeUtil.isEmpty(a) ? 'rgb' : 'rgba';
		const compsText = comps.join(', ');
		return `${funcName}(${compsText})`;
	}

	public static hsl(h: number, s: number, l: number, a?: number): string {
		const comps = [
			((Math.floor(h) % 360) + 360) % 360,
			`${NumberUtil.constrain(Math.floor(s), 0, 100)}%`,
			`${NumberUtil.constrain(Math.floor(l), 0, 100)}%`,
		];
		if (!TypeUtil.isEmpty(a)) {
			comps.push(NumberUtil.constrain(a, 0, 1));
		}
		const funcName = TypeUtil.isEmpty(a) ? 'hsl' : 'hsla';
		const compsText = comps.join(', ');
		return `${funcName}(${compsText})`;
	}

	private stringifier_: (color: Color) => string;

	constructor(stringifier: (color: Color) => string) {
		this.stringifier_ = stringifier;
	}

	public format(value: Color): string {
		return this.stringifier_(value);
	}
}
