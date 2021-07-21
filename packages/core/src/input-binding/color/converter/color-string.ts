import {createNumberFormatter} from '../../../common/converter/number';
import {Parser} from '../../../common/converter/parser';
import {formatPercentage} from '../../../common/converter/percentage';
import {constrainRange, mapRange} from '../../../common/number-util';
import {Color} from '../model/color';
import {
	ColorComponents3,
	ColorComponents4,
	removeAlphaComponent,
} from '../model/color-model';

export type StringColorNotation =
	| 'hex.rgb'
	| 'hex.rgba'
	| 'func.hsl'
	| 'func.hsla'
	| 'func.rgb'
	| 'func.rgba';

function parseCssNumberOrPercentage(text: string, maxValue: number): number {
	const m = text.match(/^(.+)%$/);
	if (!m) {
		return Math.min(parseFloat(text), maxValue);
	}
	return Math.min(parseFloat(m[1]) * 0.01 * maxValue, maxValue);
}

type CssAngleUnit = 'deg' | 'grad' | 'rad' | 'turn';
const ANGLE_TO_DEG_MAP: {
	[unit in CssAngleUnit]: (angle: number) => number;
} = {
	deg: (angle) => angle,
	grad: (angle) => (angle * 360) / 400,
	rad: (angle) => (angle * 360) / (2 * Math.PI),
	turn: (angle) => angle * 360,
};

function parseCssNumberOrAngle(text: string): number {
	const m = text.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);
	if (!m) {
		return parseFloat(text);
	}
	const angle = parseFloat(m[1]);
	const unit = m[2] as CssAngleUnit;
	return ANGLE_TO_DEG_MAP[unit](angle);
}

const NOTATION_TO_PARSER_MAP: {
	[notation in StringColorNotation]: Parser<Color>;
} = {
	'func.rgb': (text) => {
		const m = text.match(
			/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/,
		);
		if (!m) {
			return null;
		}

		const comps: ColorComponents3 = [
			parseCssNumberOrPercentage(m[1], 255),
			parseCssNumberOrPercentage(m[2], 255),
			parseCssNumberOrPercentage(m[3], 255),
		];
		if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
			return null;
		}

		return new Color(comps, 'rgb');
	},

	'func.rgba': (text) => {
		const m = text.match(
			/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/,
		);
		if (!m) {
			return null;
		}

		const comps: ColorComponents4 = [
			parseCssNumberOrPercentage(m[1], 255),
			parseCssNumberOrPercentage(m[2], 255),
			parseCssNumberOrPercentage(m[3], 255),
			parseCssNumberOrPercentage(m[4], 1),
		];
		if (
			isNaN(comps[0]) ||
			isNaN(comps[1]) ||
			isNaN(comps[2]) ||
			isNaN(comps[3])
		) {
			return null;
		}

		return new Color(comps, 'rgb');
	},

	'func.hsl': (text) => {
		const m = text.match(
			/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/,
		);
		if (!m) {
			return null;
		}

		const comps: ColorComponents3 = [
			parseCssNumberOrAngle(m[1]),
			parseCssNumberOrPercentage(m[2], 100),
			parseCssNumberOrPercentage(m[3], 100),
		];
		if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
			return null;
		}

		return new Color(comps, 'hsl');
	},

	'func.hsla': (text) => {
		const m = text.match(
			/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/,
		);
		if (!m) {
			return null;
		}

		const comps: ColorComponents4 = [
			parseCssNumberOrAngle(m[1]),
			parseCssNumberOrPercentage(m[2], 100),
			parseCssNumberOrPercentage(m[3], 100),
			parseCssNumberOrPercentage(m[4], 1),
		];
		if (
			isNaN(comps[0]) ||
			isNaN(comps[1]) ||
			isNaN(comps[2]) ||
			isNaN(comps[3])
		) {
			return null;
		}

		return new Color(comps, 'hsl');
	},

	'hex.rgb': (text) => {
		const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
		if (mRgb) {
			return new Color(
				[
					parseInt(mRgb[1] + mRgb[1], 16),
					parseInt(mRgb[2] + mRgb[2], 16),
					parseInt(mRgb[3] + mRgb[3], 16),
				],
				'rgb',
			);
		}

		const mRrggbb = text.match(
			/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/,
		);
		if (mRrggbb) {
			return new Color(
				[
					parseInt(mRrggbb[1], 16),
					parseInt(mRrggbb[2], 16),
					parseInt(mRrggbb[3], 16),
				],
				'rgb',
			);
		}

		return null;
	},

	'hex.rgba': (text) => {
		const mRgb = text.match(
			/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/,
		);
		if (mRgb) {
			return new Color(
				[
					parseInt(mRgb[1] + mRgb[1], 16),
					parseInt(mRgb[2] + mRgb[2], 16),
					parseInt(mRgb[3] + mRgb[3], 16),
					mapRange(parseInt(mRgb[4] + mRgb[4], 16), 0, 255, 0, 1),
				],
				'rgb',
			);
		}

		const mRrggbb = text.match(
			/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/,
		);
		if (mRrggbb) {
			return new Color(
				[
					parseInt(mRrggbb[1], 16),
					parseInt(mRrggbb[2], 16),
					parseInt(mRrggbb[3], 16),
					mapRange(parseInt(mRrggbb[4], 16), 0, 255, 0, 1),
				],
				'rgb',
			);
		}

		return null;
	},
};

/**
 * @hidden
 */
export function getColorNotation(text: string): StringColorNotation | null {
	const notations = Object.keys(
		NOTATION_TO_PARSER_MAP,
	) as StringColorNotation[];
	return notations.reduce((result: StringColorNotation | null, notation) => {
		if (result) {
			return result;
		}
		const subparser = NOTATION_TO_PARSER_MAP[notation];
		return subparser(text) ? notation : null;
	}, null);
}

/**
 * @hidden
 */
export const CompositeColorParser: Parser<Color> = (
	text: string,
): Color | null => {
	const notation = getColorNotation(text);
	return notation ? NOTATION_TO_PARSER_MAP[notation](text) : null;
};

export function hasAlphaComponent(notation: StringColorNotation): boolean {
	return (
		notation === 'func.hsla' ||
		notation === 'func.rgba' ||
		notation === 'hex.rgba'
	);
}

/**
 * @hidden
 */
export function colorFromString(value: unknown): Color {
	if (typeof value === 'string') {
		const cv = CompositeColorParser(value);
		if (cv) {
			return cv;
		}
	}
	return Color.black();
}

function zerofill(comp: number): string {
	const hex = constrainRange(Math.floor(comp), 0, 255).toString(16);
	return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * @hidden
 */
export function colorToHexRgbString(value: Color, prefix = '#'): string {
	const hexes = removeAlphaComponent(value.getComponents('rgb'))
		.map(zerofill)
		.join('');
	return `${prefix}${hexes}`;
}

/**
 * @hidden
 */
export function colorToHexRgbaString(value: Color, prefix = '#'): string {
	const rgbaComps = value.getComponents('rgb');
	const hexes = [rgbaComps[0], rgbaComps[1], rgbaComps[2], rgbaComps[3] * 255]
		.map(zerofill)
		.join('');
	return `${prefix}${hexes}`;
}

/**
 * @hidden
 */
export function colorToFunctionalRgbString(value: Color): string {
	const formatter = createNumberFormatter(0);
	const comps = removeAlphaComponent(value.getComponents('rgb')).map((comp) =>
		formatter(comp),
	);
	return `rgb(${comps.join(', ')})`;
}

/**
 * @hidden
 */
export function colorToFunctionalRgbaString(value: Color): string {
	const aFormatter = createNumberFormatter(2);
	const rgbFormatter = createNumberFormatter(0);
	const comps = value.getComponents('rgb').map((comp, index) => {
		const formatter = index === 3 ? aFormatter : rgbFormatter;
		return formatter(comp);
	});
	return `rgba(${comps.join(', ')})`;
}

/**
 * @hidden
 */
export function colorToFunctionalHslString(value: Color): string {
	const formatters = [
		createNumberFormatter(0),
		formatPercentage,
		formatPercentage,
	];
	const comps = removeAlphaComponent(value.getComponents('hsl')).map(
		(comp, index) => formatters[index](comp),
	);
	return `hsl(${comps.join(', ')})`;
}

/**
 * @hidden
 */
export function colorToFunctionalHslaString(value: Color): string {
	const formatters = [
		createNumberFormatter(0),
		formatPercentage,
		formatPercentage,
		createNumberFormatter(2),
	];
	const comps = value
		.getComponents('hsl')
		.map((comp, index) => formatters[index](comp));
	return `hsla(${comps.join(', ')})`;
}

const NOTATION_TO_STRINGIFIER_MAP: {
	[notation in StringColorNotation]: (value: Color) => string;
} = {
	'func.hsl': colorToFunctionalHslString,
	'func.hsla': colorToFunctionalHslaString,
	'func.rgb': colorToFunctionalRgbString,
	'func.rgba': colorToFunctionalRgbaString,
	'hex.rgb': colorToHexRgbString,
	'hex.rgba': colorToHexRgbaString,
};

export function getColorStringifier(
	notation: StringColorNotation,
): (value: Color) => string {
	return NOTATION_TO_STRINGIFIER_MAP[notation];
}
