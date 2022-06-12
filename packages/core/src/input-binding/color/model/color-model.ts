import {constrainRange, loopRange} from '../../../common/number-util';
import {Tuple3, Tuple4} from '../../../misc/type-util';

export type ColorComponents3 = Tuple3<number>;
export type ColorComponents4 = Tuple4<number>;

export type ColorMode = 'hsl' | 'hsv' | 'rgb';
export type ColorType = 'float' | 'int';

/**
 * Converts RGB color components into HSL (cylindrical, used in CSS).
 */
function rgbToHslInt(r: number, g: number, b: number): ColorComponents3 {
	const rp = constrainRange(r / 255, 0, 1);
	const gp = constrainRange(g / 255, 0, 1);
	const bp = constrainRange(b / 255, 0, 1);

	const cmax = Math.max(rp, gp, bp);
	const cmin = Math.min(rp, gp, bp);
	const c = cmax - cmin;
	let h = 0;
	let s = 0;
	const l = (cmin + cmax) / 2;

	if (c !== 0) {
		s = c / (1 - Math.abs(cmax + cmin - 1));

		if (rp === cmax) {
			h = (gp - bp) / c;
		} else if (gp === cmax) {
			h = 2 + (bp - rp) / c;
		} else {
			h = 4 + (rp - gp) / c;
		}

		h = h / 6 + (h < 0 ? 1 : 0);
	}

	return [h * 360, s * 100, l * 100];
}

function hslToRgbInt(h: number, s: number, l: number): ColorComponents3 {
	const hp = ((h % 360) + 360) % 360;
	const sp = constrainRange(s / 100, 0, 1);
	const lp = constrainRange(l / 100, 0, 1);

	const c = (1 - Math.abs(2 * lp - 1)) * sp;
	const x = c * (1 - Math.abs(((hp / 60) % 2) - 1));
	const m = lp - c / 2;

	let rp, gp, bp;
	if (hp >= 0 && hp < 60) {
		[rp, gp, bp] = [c, x, 0];
	} else if (hp >= 60 && hp < 120) {
		[rp, gp, bp] = [x, c, 0];
	} else if (hp >= 120 && hp < 180) {
		[rp, gp, bp] = [0, c, x];
	} else if (hp >= 180 && hp < 240) {
		[rp, gp, bp] = [0, x, c];
	} else if (hp >= 240 && hp < 300) {
		[rp, gp, bp] = [x, 0, c];
	} else {
		[rp, gp, bp] = [c, 0, x];
	}

	return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
}

function rgbToHsvInt(r: number, g: number, b: number): ColorComponents3 {
	const rp = constrainRange(r / 255, 0, 1);
	const gp = constrainRange(g / 255, 0, 1);
	const bp = constrainRange(b / 255, 0, 1);

	const cmax = Math.max(rp, gp, bp);
	const cmin = Math.min(rp, gp, bp);
	const d = cmax - cmin;

	let h;
	if (d === 0) {
		h = 0;
	} else if (cmax === rp) {
		h = 60 * (((((gp - bp) / d) % 6) + 6) % 6);
	} else if (cmax === gp) {
		h = 60 * ((bp - rp) / d + 2);
	} else {
		h = 60 * ((rp - gp) / d + 4);
	}

	const s = cmax === 0 ? 0 : d / cmax;
	const v = cmax;

	return [h, s * 100, v * 100];
}

/**
 * @hidden
 */
export function hsvToRgbInt(h: number, s: number, v: number): ColorComponents3 {
	const hp = loopRange(h, 360);
	const sp = constrainRange(s / 100, 0, 1);
	const vp = constrainRange(v / 100, 0, 1);

	const c = vp * sp;
	const x = c * (1 - Math.abs(((hp / 60) % 2) - 1));
	const m = vp - c;

	let rp, gp, bp;
	if (hp >= 0 && hp < 60) {
		[rp, gp, bp] = [c, x, 0];
	} else if (hp >= 60 && hp < 120) {
		[rp, gp, bp] = [x, c, 0];
	} else if (hp >= 120 && hp < 180) {
		[rp, gp, bp] = [0, c, x];
	} else if (hp >= 180 && hp < 240) {
		[rp, gp, bp] = [0, x, c];
	} else if (hp >= 240 && hp < 300) {
		[rp, gp, bp] = [x, 0, c];
	} else {
		[rp, gp, bp] = [c, 0, x];
	}

	return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
}

/**
 * @hidden
 */
export function hslToHsvInt(h: number, s: number, l: number): ColorComponents3 {
	const sd = l + (s * (100 - Math.abs(2 * l - 100))) / (2 * 100);
	return [
		h,
		sd !== 0 ? (s * (100 - Math.abs(2 * l - 100))) / sd : 0,
		l + (s * (100 - Math.abs(2 * l - 100))) / (2 * 100),
	];
}

/**
 * @hidden
 */
export function hsvToHslInt(h: number, s: number, v: number): ColorComponents3 {
	const sd = 100 - Math.abs((v * (200 - s)) / 100 - 100);
	return [h, sd !== 0 ? (s * v) / sd : 0, (v * (200 - s)) / (2 * 100)];
}

/**
 * @hidden
 */
export function removeAlphaComponent(
	comps: ColorComponents4,
): ColorComponents3 {
	return [comps[0], comps[1], comps[2]];
}

/**
 * @hidden
 */
export function appendAlphaComponent(
	comps: ColorComponents3,
	alpha: number,
): ColorComponents4 {
	return [comps[0], comps[1], comps[2], alpha];
}

const MODE_CONVERTER_MAP: {
	[fromMode in ColorMode]: {
		[toMode in ColorMode]: (
			c1: number,
			c2: number,
			c3: number,
		) => ColorComponents3;
	};
} = {
	hsl: {
		hsl: (h, s, l) => [h, s, l],
		hsv: hslToHsvInt,
		rgb: hslToRgbInt,
	},
	hsv: {
		hsl: hsvToHslInt,
		hsv: (h, s, v) => [h, s, v],
		rgb: hsvToRgbInt,
	},
	rgb: {
		hsl: rgbToHslInt,
		hsv: rgbToHsvInt,
		rgb: (r, g, b) => [r, g, b],
	},
};

/**
 * @hidden
 */
export function getColorMaxComponents(
	mode: ColorMode,
	type: ColorType,
): ColorComponents3 {
	return [
		type === 'float' ? 1 : mode === 'rgb' ? 255 : 360,
		type === 'float' ? 1 : mode === 'rgb' ? 255 : 100,
		type === 'float' ? 1 : mode === 'rgb' ? 255 : 100,
	];
}

/**
 * @hidden
 */
export function constrainColorComponents(
	components: ColorComponents3 | ColorComponents4,
	mode: ColorMode,
	type: ColorType,
): ColorComponents4 {
	const ms = getColorMaxComponents(mode, type);
	return [
		mode === 'rgb'
			? constrainRange(components[0], 0, ms[0])
			: loopRange(components[0], ms[0]),
		constrainRange(components[1], 0, ms[1]),
		constrainRange(components[2], 0, ms[2]),
		constrainRange(components[3] ?? 1, 0, 1),
	];
}

function convertColorType(
	comps: ColorComponents3,
	mode: ColorMode,
	from: ColorType,
	to: ColorType,
): ColorComponents3 {
	const fms = getColorMaxComponents(mode, from);
	const tms = getColorMaxComponents(mode, to);
	return comps.map(
		(c, index) => (c / fms[index]) * tms[index],
	) as ColorComponents3;
}

/**
 * @hidden
 */
export function convertColor(
	components: ColorComponents3,
	from: {mode: ColorMode; type: ColorType},
	to: {mode: ColorMode; type: ColorType},
): ColorComponents3 {
	const intComps = convertColorType(components, from.mode, from.type, 'int');
	const result = MODE_CONVERTER_MAP[from.mode][to.mode](...intComps);
	return convertColorType(result, to.mode, 'int', to.type);
}
