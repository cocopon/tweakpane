// @flow

import Color from '../model/color';

import {Parser} from './parser';

const SUB_PARSERS: Parser<Color>[] = [
	// #aabbcc
	(text: string): Color | null => {
		const matches = text.match(
			/^#?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/,
		);
		if (!matches) {
			return null;
		}
		return new Color(
			parseInt(matches[1], 16),
			parseInt(matches[2], 16),
			parseInt(matches[3], 16),
		);
	},
	// #abc
	(text: string): Color | null => {
		const matches = text.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
		if (!matches) {
			return null;
		}
		return new Color(
			parseInt(matches[1] + matches[1], 16),
			parseInt(matches[2] + matches[2], 16),
			parseInt(matches[3] + matches[3], 16),
		);
	},
];

const ColorParser: Parser<Color> = (text: string): Color | null => {
	return SUB_PARSERS.reduce((result: Color | null, subparser) => {
		return result ? result : subparser(text);
	}, null);
};

export default ColorParser;
