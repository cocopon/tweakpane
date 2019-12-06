import {Color} from '../model/color';
import {Parser} from './parser';

type ColorParserId = 'hex.rrggbb';

const ID_TO_PARSER_MAP: {[id in ColorParserId]: Parser<string, Color>} = {
	'hex.rrggbb': (text: string): Color | null => {
		const mRrggbb = text.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
		if (mRrggbb) {
			return new Color(
				[
					parseInt(mRrggbb[1] + mRrggbb[1], 16),
					parseInt(mRrggbb[2] + mRrggbb[2], 16),
					parseInt(mRrggbb[3] + mRrggbb[3], 16),
				],
				'rgb',
			);
		}

		const mRgb = text.match(
			/^#?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/,
		);
		if (mRgb) {
			return new Color(
				[parseInt(mRgb[1], 16), parseInt(mRgb[2], 16), parseInt(mRgb[3], 16)],
				'rgb',
			);
		}

		return null;
	},
};

/**
 * @hidden
 */
export const StringColorParser: Parser<string, Color> = (
	text: string,
): Color | null => {
	const ids: ColorParserId[] = Object.keys(ID_TO_PARSER_MAP) as ColorParserId[];
	return ids.reduce((result: Color | null, id) => {
		const subparser = ID_TO_PARSER_MAP[id];
		return result ? result : subparser(text);
	}, null);
};
