import * as ColorConverter from '../converter/color';
import NumberUtil from '../misc/number-util';
import Color from '../model/color';

import {Formatter} from './formatter';

export default class ColorFormatter implements Formatter<Color> {
	public static rgb(r: number, g: number, b: number): string {
		const compsText = [
			NumberUtil.constrain(Math.floor(r), 0, 255),
			NumberUtil.constrain(Math.floor(g), 0, 255),
			NumberUtil.constrain(Math.floor(b), 0, 255),
		].join(', ');
		return `rgb(${compsText})`;
	}

	public static hsl(h: number, s: number, l: number): string {
		const compsText = [
			((Math.floor(h) % 360) + 360) % 360,
			`${NumberUtil.constrain(Math.floor(s), 0, 100)}%`,
			`${NumberUtil.constrain(Math.floor(l), 0, 100)}%`,
		].join(', ');
		return `hsl(${compsText})`;
	}

	public format(value: Color): string {
		return ColorConverter.toString(value);
	}
}
