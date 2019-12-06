import {Color} from '../model/color';
import {Parser} from './parser';

type ColorParserId = 'hex.rgb' | 'func.rgb';

function parseCssNumberOrPercentage(text: string, maxValue: number): number {
	const m = text.match(/^(.+)%$/);
	if (!m) {
		return Math.min(parseFloat(text), maxValue);
	}
	return Math.min(parseFloat(m[1]) * 0.01 * maxValue, maxValue);
}

const ID_TO_PARSER_MAP: {[id in ColorParserId]: Parser<string, Color>} = {
	'func.rgb': (text) => {
		const m = text.match(
			/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/,
		);
		if (!m) {
			return null;
		}

		const comps: [number, number, number] = [
			parseCssNumberOrPercentage(m[1], 255),
			parseCssNumberOrPercentage(m[2], 255),
			parseCssNumberOrPercentage(m[3], 255),
		];
		if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
			return null;
		}

		return new Color(comps, 'rgb');
	},
	'hex.rgb': (text) => {
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
