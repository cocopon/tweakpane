// @flow

import * as ColorConverter from '../converter/color';

import type {Color} from '../model/color';
import type {Formatter} from './formatter';

export default class ColorFormatter implements Formatter<Color> {
	format(value: Color): string {
		return ColorConverter.toString(value);
	}
}
