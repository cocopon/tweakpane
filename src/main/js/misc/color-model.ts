// @flow

import NumberUtil from './number-util';

export function rgbToHsl(
	r: number,
	g: number,
	b: number,
): [number, number, number] {
	const rp = NumberUtil.constrain(r / 255, 0, 1);
	const gp = NumberUtil.constrain(g / 255, 0, 1);
	const bp = NumberUtil.constrain(b / 255, 0, 1);

	const cmax = Math.max(rp, gp, bp);
	const cmin = Math.min(rp, gp, bp);
	const c = cmax - cmin;
	let h = 0;
	let s = 0;
	const l = (cmin + cmax) / 2;

	if (c !== 0) {
		s = l > 0.5 ? c / (2 - cmin - cmax) : c / (cmax + cmin);

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

export function hslToRgb(
	h: number,
	s: number,
	l: number,
): [number, number, number] {
	const hp = ((h % 360) + 360) % 360;
	const sp = NumberUtil.constrain(s / 100, 0, 1);
	const lp = NumberUtil.constrain(l / 100, 0, 1);

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

export function rgbToHsv(r: number, g: number, b: number): number[] {
	const rp = NumberUtil.constrain(r / 255, 0, 1);
	const gp = NumberUtil.constrain(g / 255, 0, 1);
	const bp = NumberUtil.constrain(b / 255, 0, 1);

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

export function hsvToRgb(
	h: number,
	s: number,
	v: number,
): [number, number, number] {
	const hp = ((h % 360) + 360) % 360;
	const sp = NumberUtil.constrain(s / 100, 0, 1);
	const vp = NumberUtil.constrain(v / 100, 0, 1);

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
