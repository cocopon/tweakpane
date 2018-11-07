// @flow

import type {Color} from '../model/color';
import type {Parser} from './parser';

const SUB_PARSERS = [
	// #aabbcc
	(text: string): ?Color => {
		const matches = text.match(/^#?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
		if (!matches) {
			return null;
		}
		return {
			r: parseInt(matches[1], 16),
			g: parseInt(matches[2], 16),
			b: parseInt(matches[3], 16),
		};
	},
	// #abc
	(text: string): ?Color => {
		const matches = text.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
		if (!matches) {
			return null;
		}
		return {
			r: parseInt(matches[1] + matches[1], 16),
			g: parseInt(matches[2] + matches[2], 16),
			b: parseInt(matches[3] + matches[3], 16),
		};
	},
	, 
];

const ColorParser: Parser<Color> = (text: string): ?Color => {
	return SUB_PARSERS.reduce((result: ?Color, subparser) => {
		return result ?
			result :
			subparser(text);
	}, null);
};

export default ColorParser;
