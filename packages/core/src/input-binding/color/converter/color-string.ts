import {Formatter} from '../../../common/converter/formatter.js';
import {createNumberFormatter} from '../../../common/converter/number.js';
import {composeParsers, Parser} from '../../../common/converter/parser.js';
import {formatPercentage} from '../../../common/converter/percentage.js';
import {constrainRange, mapRange} from '../../../common/number/util.js';
import {Color} from '../model/color.js';
import {
	ColorComponents3,
	ColorComponents4,
	ColorMode,
	ColorType,
	removeAlphaComponent,
} from '../model/color-model.js';
import {createColor, mapColorType} from '../model/colors.js';
import {FloatColor} from '../model/float-color.js';
import {IntColor} from '../model/int-color.js';

type StringColorNotation = 'func' | 'hex' | 'object';

export interface StringColorFormat {
	alpha: boolean;
	mode: ColorMode;
	notation: StringColorNotation;
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

function parseCssNumberOrPercentage(text: string, max: number): number {
	const m = text.match(/^(.+)%$/);
	if (!m) {
		return Math.min(parseFloat(text), max);
	}
	return Math.min(parseFloat(m[1]) * 0.01 * max, max);
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

function parseFunctionalRgbColor(text: string): IntColor | null {
	const comps = parseFunctionalRgbColorComponents(text);
	return comps ? new IntColor(comps, 'rgb') : null;
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

function parseFunctionalRgbaColor(text: string): IntColor | null {
	const comps = parseFunctionalRgbaColorComponents(text);
	return comps ? new IntColor(comps, 'rgb') : null;
}

function parseFunctionalHslColorComponents(
	text: string,
): ColorComponents3 | null {
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

function parseFunctionalHslColor(text: string): IntColor | null {
	const comps = parseFunctionalHslColorComponents(text);
	return comps ? new IntColor(comps, 'hsl') : null;
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

function parseFunctionalHslaColor(text: string): IntColor | null {
	const comps = parseHslaColorComponents(text);
	return comps ? new IntColor(comps, 'hsl') : null;
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

function parseHexRgbColor(text: string): IntColor | null {
	const comps = parseHexRgbColorComponents(text);
	return comps ? new IntColor(comps, 'rgb') : null;
}

function parseHexRgbaColorComponents(text: string): ColorComponents4 | null {
	const mRgb = text.match(
		/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/,
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

function parseHexRgbaColor(text: string): IntColor | null {
	const comps = parseHexRgbaColorComponents(text);
	return comps ? new IntColor(comps, 'rgb') : null;
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

function createObjectRgbColorParser(type: 'int'): Parser<IntColor>;
function createObjectRgbColorParser(type: 'float'): Parser<FloatColor>;
function createObjectRgbColorParser(type: ColorType): Parser<Color> {
	return (text) => {
		const comps = parseObjectRgbColorComponents(text);
		return comps ? createColor(comps, 'rgb', type) : null;
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

function createObjectRgbaColorParser(type: 'int'): Parser<IntColor>;
function createObjectRgbaColorParser(type: 'float'): Parser<FloatColor>;
function createObjectRgbaColorParser(type: ColorType): Parser<Color> {
	return (text) => {
		const comps = parseObjectRgbaColorComponents(text);
		return comps ? createColor(comps, 'rgb', type) : null;
	};
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
		parser: parseFunctionalHslColorComponents,
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

export function createColorStringParser(type: 'int'): Parser<IntColor>;
export function createColorStringParser(type: 'float'): Parser<FloatColor>;
export function createColorStringParser(type: ColorType): Parser<Color> {
	const parsers: Parser<Color>[] = [
		parseHexRgbColor,
		parseHexRgbaColor,
		parseFunctionalRgbColor,
		parseFunctionalRgbaColor,
		parseFunctionalHslColor,
		parseFunctionalHslaColor,
	];
	if (type === 'int') {
		parsers.push(
			createObjectRgbColorParser('int'),
			createObjectRgbaColorParser('int'),
		);
	}
	if (type === 'float') {
		parsers.push(
			createObjectRgbColorParser('float'),
			createObjectRgbaColorParser('float'),
		);
	}
	const parser = composeParsers(parsers);

	return (text) => {
		const result = parser(text);
		return result ? mapColorType(result, type) : null;
	};
}

export function readIntColorString(value: unknown): IntColor {
	const parser = createColorStringParser('int');
	if (typeof value !== 'string') {
		return IntColor.black();
	}

	const result = parser(value);
	return result ?? IntColor.black();
}

function zerofill(comp: number): string {
	const hex = constrainRange(Math.floor(comp), 0, 255).toString(16);
	return hex.length === 1 ? `0${hex}` : hex;
}

export function colorToHexRgbString(value: IntColor, prefix = '#'): string {
	const hexes = removeAlphaComponent(value.getComponents('rgb'))
		.map(zerofill)
		.join('');
	return `${prefix}${hexes}`;
}

export function colorToHexRgbaString(value: IntColor, prefix = '#'): string {
	const rgbaComps = value.getComponents('rgb');
	const hexes = [rgbaComps[0], rgbaComps[1], rgbaComps[2], rgbaComps[3] * 255]
		.map(zerofill)
		.join('');
	return `${prefix}${hexes}`;
}

export function colorToFunctionalRgbString(value: Color): string {
	const formatter = createNumberFormatter(0);
	const ci = mapColorType(value, 'int');
	const comps = removeAlphaComponent(ci.getComponents('rgb')).map((comp) =>
		formatter(comp),
	);
	return `rgb(${comps.join(', ')})`;
}

export function colorToFunctionalRgbaString(value: Color): string {
	const aFormatter = createNumberFormatter(2);
	const rgbFormatter = createNumberFormatter(0);
	const ci = mapColorType(value, 'int');
	const comps = ci.getComponents('rgb').map((comp, index) => {
		const formatter = index === 3 ? aFormatter : rgbFormatter;
		return formatter(comp);
	});
	return `rgba(${comps.join(', ')})`;
}

export function colorToFunctionalHslString(value: Color): string {
	const formatters = [
		createNumberFormatter(0),
		formatPercentage,
		formatPercentage,
	];
	const ci = mapColorType(value, 'int');
	const comps = removeAlphaComponent(ci.getComponents('hsl')).map(
		(comp, index) => formatters[index](comp),
	);
	return `hsl(${comps.join(', ')})`;
}

export function colorToFunctionalHslaString(value: Color): string {
	const formatters = [
		createNumberFormatter(0),
		formatPercentage,
		formatPercentage,
		createNumberFormatter(2),
	];
	const ci = mapColorType(value, 'int');
	const comps = ci
		.getComponents('hsl')
		.map((comp, index) => formatters[index](comp));
	return `hsla(${comps.join(', ')})`;
}

export function colorToObjectRgbString(value: Color, type: ColorType): string {
	const formatter = createNumberFormatter(type === 'float' ? 2 : 0);
	const names = ['r', 'g', 'b'];
	const cc = mapColorType(value, type);
	const comps = removeAlphaComponent(cc.getComponents('rgb')).map(
		(comp, index) => `${names[index]}: ${formatter(comp)}`,
	);
	return `{${comps.join(', ')}}`;
}

function createObjectRgbColorFormatter(type: ColorType): Formatter<Color> {
	return (value) => colorToObjectRgbString(value, type);
}

export function colorToObjectRgbaString(value: Color, type: ColorType): string {
	const aFormatter = createNumberFormatter(2);
	const rgbFormatter = createNumberFormatter(type === 'float' ? 2 : 0);
	const names = ['r', 'g', 'b', 'a'];
	const cc = mapColorType(value, type);
	const comps = cc.getComponents('rgb').map((comp, index) => {
		const formatter = index === 3 ? aFormatter : rgbFormatter;
		return `${names[index]}: ${formatter(comp)}`;
	});
	return `{${comps.join(', ')}}`;
}

function createObjectRgbaColorFormatter(type: ColorType): Formatter<Color> {
	return (value) => colorToObjectRgbaString(value, type);
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
		stringifier: colorToHexRgbString as Formatter<Color>,
	},
	{
		format: {
			alpha: true,
			mode: 'rgb',
			notation: 'hex',
			type: 'int',
		},
		stringifier: colorToHexRgbaString as Formatter<Color>,
	},
	{
		format: {
			alpha: false,
			mode: 'rgb',
			notation: 'func',
			type: 'int',
		},
		stringifier: colorToFunctionalRgbString,
	},
	{
		format: {
			alpha: true,
			mode: 'rgb',
			notation: 'func',
			type: 'int',
		},
		stringifier: colorToFunctionalRgbaString,
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
