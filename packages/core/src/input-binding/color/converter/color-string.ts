import {BindingReader} from '../../../common/binding/binding';
import {Formatter} from '../../../common/converter/formatter';
import {createNumberFormatter} from '../../../common/converter/number';
import {Parser} from '../../../common/converter/parser';
import {formatPercentage} from '../../../common/converter/percentage';
import {constrainRange, mapRange} from '../../../common/number-util';
import {Color} from '../model/color';
import {
	ColorComponents3,
	ColorComponents4,
	ColorMode,
	ColorType,
	removeAlphaComponent,
} from '../model/color-model';

/**
 * @deprecated
 */
export type StringColorNotation =
	| 'hex.rgb'
	| 'hex.rgba'
	| 'func.hsl'
	| 'func.hsla'
	| 'func.rgb'
	| 'func.rgba';

// TODO: Rename
type StringColorNotation2 = 'func' | 'hex' | 'object';

export interface StringColorFormat {
	alpha: boolean;
	mode: ColorMode;
	notation: StringColorNotation2;
	type: ColorType;
}

function equalsStringColorFormat(
	f1: StringColorFormat,
	f2: StringColorFormat,
): boolean {
	return (
		f1.alpha === f2.alpha &&
		f1.mode === f2.mode &&
		f1.notation === f2.notation &&
		f1.type === f2.type
	);
}

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

function parseFunctionalRgbColorComponents(
	text: string,
): ColorComponents3 | null {
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
	return comps;
}

function createFunctionalRgbColorParser(type: ColorType): Parser<Color> {
	return (text) => {
		const comps = parseFunctionalRgbColorComponents(text);
		return comps ? new Color(comps, 'rgb', type) : null;
	};
}

function parseFunctionalRgbaColorComponents(
	text: string,
): ColorComponents4 | null {
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
	return comps;
}

function createFunctionalRgbaColorParser(type: ColorType): Parser<Color> {
	return (text) => {
		const comps = parseFunctionalRgbaColorComponents(text);
		return comps ? new Color(comps, 'rgb', type) : null;
	};
}

function parseHslColorComponents(text: string): ColorComponents3 | null {
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
	return comps;
}

function createHslColorParser(type: ColorType): Parser<Color> {
	return (text) => {
		const comps = parseHslColorComponents(text);
		return comps ? new Color(comps, 'hsl', type) : null;
	};
}

function parseHslaColorComponents(text: string): ColorComponents4 | null {
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
	return comps;
}

function createHslaColorParser(type: ColorType): Parser<Color> {
	return (text) => {
		const comps = parseHslaColorComponents(text);
		return comps ? new Color(comps, 'hsl', type) : null;
	};
}

function parseHexRgbColorComponents(text: string): ColorComponents3 | null {
	const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
	if (mRgb) {
		return [
			parseInt(mRgb[1] + mRgb[1], 16),
			parseInt(mRgb[2] + mRgb[2], 16),
			parseInt(mRgb[3] + mRgb[3], 16),
		];
	}

	const mRrggbb = text.match(
		/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/,
	);
	if (mRrggbb) {
		return [
			parseInt(mRrggbb[1], 16),
			parseInt(mRrggbb[2], 16),
			parseInt(mRrggbb[3], 16),
		];
	}
	return null;
}

function parseHexRgbColor(text: string): Color | null {
	const comps = parseHexRgbColorComponents(text);
	return comps ? new Color(comps, 'rgb', 'int') : null;
}

function parseHexRgbaColorComponents(text: string): ColorComponents4 | null {
	const mRgb = text.match(
		/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/,
	);
	if (mRgb) {
		return [
			parseInt(mRgb[1] + mRgb[1], 16),
			parseInt(mRgb[2] + mRgb[2], 16),
			parseInt(mRgb[3] + mRgb[3], 16),
			mapRange(parseInt(mRgb[4] + mRgb[4], 16), 0, 255, 0, 1),
		];
	}

	const mRrggbb = text.match(
		/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/,
	);
	if (mRrggbb) {
		return [
			parseInt(mRrggbb[1], 16),
			parseInt(mRrggbb[2], 16),
			parseInt(mRrggbb[3], 16),
			mapRange(parseInt(mRrggbb[4], 16), 0, 255, 0, 1),
		];
	}

	return null;
}

function parseHexRgbaColor(text: string): Color | null {
	const comps = parseHexRgbaColorComponents(text);
	return comps ? new Color(comps, 'rgb', 'int') : null;
}

function parseObjectRgbColorComponents(text: string): ColorComponents3 | null {
	const m = text.match(
		/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/,
	);
	if (!m) {
		return null;
	}

	const comps: ColorComponents3 = [
		parseFloat(m[1]),
		parseFloat(m[2]),
		parseFloat(m[3]),
	];
	if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
		return null;
	}
	return comps;
}

function createObjectRgbColorParser(type: ColorType): Parser<Color> {
	return (text) => {
		const comps = parseObjectRgbColorComponents(text);
		return comps ? new Color(comps, 'rgb', type) : null;
	};
}

function parseObjectRgbaColorComponents(text: string): ColorComponents4 | null {
	const m = text.match(
		/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/,
	);
	if (!m) {
		return null;
	}

	const comps: ColorComponents4 = [
		parseFloat(m[1]),
		parseFloat(m[2]),
		parseFloat(m[3]),
		parseFloat(m[4]),
	];
	if (
		isNaN(comps[0]) ||
		isNaN(comps[1]) ||
		isNaN(comps[2]) ||
		isNaN(comps[3])
	) {
		return null;
	}
	return comps;
}

function createObjectRgbaColorParser(type: ColorType): Parser<Color> {
	return (text) => {
		const comps = parseObjectRgbaColorComponents(text);
		return comps ? new Color(comps, 'rgb', type) : null;
	};
}

const NOTATION_TO_PARSER_MAP: {
	[notation in StringColorNotation]: Parser<Color>;
} = {
	'func.rgb': createFunctionalRgbColorParser('int'),
	'func.rgba': createFunctionalRgbaColorParser('int'),
	'func.hsl': createHslColorParser('int'),
	'func.hsla': createHslaColorParser('int'),
	'hex.rgb': parseHexRgbColor,
	'hex.rgba': parseHexRgbaColor,
};

/**
 * @deprecated
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

type DetectionResult = Omit<StringColorFormat, 'type'>;

const PARSER_AND_RESULT: {
	parser: Parser<unknown>;
	result: DetectionResult;
}[] = [
	{
		parser: parseHexRgbColorComponents,
		result: {
			alpha: false,
			mode: 'rgb',
			notation: 'hex',
		},
	},
	{
		parser: parseHexRgbaColorComponents,
		result: {
			alpha: true,
			mode: 'rgb',
			notation: 'hex',
		},
	},
	{
		parser: parseFunctionalRgbColorComponents,
		result: {
			alpha: false,
			mode: 'rgb',
			notation: 'func',
		},
	},
	{
		parser: parseFunctionalRgbaColorComponents,
		result: {
			alpha: true,
			mode: 'rgb',
			notation: 'func',
		},
	},
	{
		parser: parseHslColorComponents,
		result: {
			alpha: false,
			mode: 'hsl',
			notation: 'func',
		},
	},
	{
		parser: parseHslaColorComponents,
		result: {
			alpha: true,
			mode: 'hsl',
			notation: 'func',
		},
	},
	{
		parser: parseObjectRgbColorComponents,
		result: {
			alpha: false,
			mode: 'rgb',
			notation: 'object',
		},
	},
	{
		parser: parseObjectRgbaColorComponents,
		result: {
			alpha: true,
			mode: 'rgb',
			notation: 'object',
		},
	},
];

function detectStringColor(text: string): DetectionResult | null {
	return PARSER_AND_RESULT.reduce(
		(prev: DetectionResult | null, {parser, result: detection}) => {
			if (prev) {
				return prev;
			}
			return parser(text) ? detection : null;
		},
		null,
	);
}

export function detectStringColorFormat(
	text: string,
	type: ColorType = 'int',
): StringColorFormat | null {
	const r = detectStringColor(text);
	if (!r) {
		return null;
	}
	if (r.notation === 'hex' && type !== 'float') {
		return {
			...r,
			type: 'int',
		};
	}
	if (r.notation === 'func') {
		return {
			...r,
			type: type,
		};
	}
	return null;
}

/**
 * @deprecated Use createColorStringParser instead.
 * @hidden
 */
export const CompositeColorParser: Parser<Color> = (
	text: string,
): Color | null => {
	const notation = getColorNotation(text);
	return notation ? NOTATION_TO_PARSER_MAP[notation](text) : null;
};

const TYPE_TO_PARSERS: {[type in ColorType]: Parser<Color>[]} = {
	int: [
		parseHexRgbColor,
		parseHexRgbaColor,
		createFunctionalRgbColorParser('int'),
		createFunctionalRgbaColorParser('int'),
		createHslColorParser('int'),
		createHslaColorParser('int'),
		createObjectRgbColorParser('int'),
		createObjectRgbaColorParser('int'),
	],
	float: [
		createFunctionalRgbColorParser('float'),
		createFunctionalRgbaColorParser('float'),
		createHslColorParser('float'),
		createHslaColorParser('float'),
		createObjectRgbColorParser('float'),
		createObjectRgbaColorParser('float'),
	],
};

export function createColorStringBindingReader(
	type: ColorType,
): BindingReader<Color> {
	const parsers = TYPE_TO_PARSERS[type];
	return (value) => {
		if (typeof value !== 'string') {
			return Color.black(type);
		}

		const result = parsers.reduce((prev: Color | null, parser) => {
			if (prev) {
				return prev;
			}
			return parser(value);
		}, null);
		return result ?? Color.black(type);
	};
}

export function createColorStringParser(type: ColorType): Parser<Color> {
	const parsers = TYPE_TO_PARSERS[type];
	return (value) => {
		return parsers.reduce((prev: Color | null, parser) => {
			if (prev) {
				return prev;
			}
			return parser(value);
		}, null);
	};
}

/**
 * @deprecated
 * @hidden
 */
export function hasAlphaComponent(notation: StringColorNotation): boolean {
	return (
		notation === 'func.hsla' ||
		notation === 'func.rgba' ||
		notation === 'hex.rgba'
	);
}

/**
 * @deprecated
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

// TODO: Make type required in the next major version
/**
 * @hidden
 */
export function colorToFunctionalRgbString(
	value: Color,
	opt_type?: ColorType,
): string {
	const formatter = createNumberFormatter(opt_type === 'float' ? 2 : 0);
	const comps = removeAlphaComponent(value.getComponents('rgb', opt_type)).map(
		(comp) => formatter(comp),
	);
	return `rgb(${comps.join(', ')})`;
}

function createFunctionalRgbColorFormatter(type: ColorType): Formatter<Color> {
	return (value) => {
		return colorToFunctionalRgbString(value, type);
	};
}

// TODO: Make type required in the next major version
/**
 * @hidden
 */
export function colorToFunctionalRgbaString(
	value: Color,
	opt_type?: ColorType,
): string {
	const aFormatter = createNumberFormatter(2);
	const rgbFormatter = createNumberFormatter(opt_type === 'float' ? 2 : 0);
	const comps = value.getComponents('rgb', opt_type).map((comp, index) => {
		const formatter = index === 3 ? aFormatter : rgbFormatter;
		return formatter(comp);
	});
	return `rgba(${comps.join(', ')})`;
}

function createFunctionalRgbaColorFormatter(type: ColorType): Formatter<Color> {
	return (value) => {
		return colorToFunctionalRgbaString(value, type);
	};
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

/**
 * @hidden
 */
export function colorToObjectRgbString(value: Color, type: ColorType): string {
	const formatter = createNumberFormatter(type === 'float' ? 2 : 0);
	const names = ['r', 'g', 'b'];
	const comps = removeAlphaComponent(value.getComponents('rgb', type)).map(
		(comp, index) => `${names[index]}: ${formatter(comp)}`,
	);
	return `{${comps.join(', ')}}`;
}

function createObjectRgbColorFormatter(type: ColorType): Formatter<Color> {
	return (value) => colorToObjectRgbString(value, type);
}

/**
 * @hidden
 */
export function colorToObjectRgbaString(value: Color, type: ColorType): string {
	const aFormatter = createNumberFormatter(2);
	const rgbFormatter = createNumberFormatter(type === 'float' ? 2 : 0);
	const names = ['r', 'g', 'b', 'a'];
	const comps = value.getComponents('rgb', type).map((comp, index) => {
		const formatter = index === 3 ? aFormatter : rgbFormatter;
		return `${names[index]}: ${formatter(comp)}`;
	});
	return `{${comps.join(', ')}}`;
}

function createObjectRgbaColorFormatter(type: ColorType): Formatter<Color> {
	return (value) => colorToObjectRgbaString(value, type);
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

/**
 * @deprecated
 */
export function getColorStringifier(
	notation: StringColorNotation,
): (value: Color) => string {
	return NOTATION_TO_STRINGIFIER_MAP[notation];
}

interface FormatAndStringifier {
	format: StringColorFormat;
	stringifier: Formatter<Color>;
}

const FORMAT_AND_STRINGIFIERS: FormatAndStringifier[] = [
	{
		format: {
			alpha: false,
			mode: 'rgb',
			notation: 'hex',
			type: 'int',
		},
		stringifier: colorToHexRgbString,
	},
	{
		format: {
			alpha: true,
			mode: 'rgb',
			notation: 'hex',
			type: 'int',
		},
		stringifier: colorToHexRgbaString,
	},
	{
		format: {
			alpha: false,
			mode: 'hsl',
			notation: 'func',
			type: 'int',
		},
		stringifier: colorToFunctionalHslString,
	},
	{
		format: {
			alpha: true,
			mode: 'hsl',
			notation: 'func',
			type: 'int',
		},
		stringifier: colorToFunctionalHslaString,
	},
	...(['int', 'float'] as ColorType[]).reduce(
		(prev: FormatAndStringifier[], type) => {
			return [
				...prev,
				{
					format: {
						alpha: false,
						mode: 'rgb',
						notation: 'func',
						type: type,
					},
					stringifier: createFunctionalRgbColorFormatter(type),
				},
				{
					format: {
						alpha: true,
						mode: 'rgb',
						notation: 'func',
						type: type,
					},
					stringifier: createFunctionalRgbaColorFormatter(type),
				},
				{
					format: {
						alpha: false,
						mode: 'rgb',
						notation: 'object',
						type: type,
					},
					stringifier: createObjectRgbColorFormatter(type),
				},
				{
					format: {
						alpha: true,
						mode: 'rgb',
						notation: 'object',
						type: type,
					},
					stringifier: createObjectRgbaColorFormatter(type),
				},
			] as FormatAndStringifier[];
		},
		[],
	),
];

export function findColorStringifier(
	format: StringColorFormat,
): Formatter<Color> | null {
	return FORMAT_AND_STRINGIFIERS.reduce(
		(prev: Formatter<Color> | null, fas) => {
			if (prev) {
				return prev;
			}
			return equalsStringColorFormat(fas.format, format)
				? fas.stringifier
				: null;
		},
		null,
	);
}
