import {isEmpty} from '../../../misc/type-util.js';
import {
	ColorComponents3,
	ColorComponents4,
	ColorMode,
	ColorType,
} from './color-model.js';

export interface RgbColorObject {
	r: number;
	g: number;
	b: number;
}
export interface RgbaColorObject {
	r: number;
	g: number;
	b: number;
	a: number;
}

function isRgbColorComponent(obj: any, key: string): boolean {
	if (typeof obj !== 'object' || isEmpty(obj)) {
		return false;
	}
	return key in obj && typeof obj[key] === 'number';
}

export function isRgbColorObject(obj: unknown): obj is RgbColorObject {
	return (
		isRgbColorComponent(obj, 'r') &&
		isRgbColorComponent(obj, 'g') &&
		isRgbColorComponent(obj, 'b')
	);
}

export function isRgbaColorObject(obj: unknown): obj is RgbaColorObject {
	return isRgbColorObject(obj) && isRgbColorComponent(obj, 'a');
}

export function isColorObject(
	obj: unknown,
): obj is RgbColorObject | RgbaColorObject {
	return isRgbColorObject(obj);
}

export interface Color {
	readonly mode: ColorMode;
	readonly type: ColorType;

	getComponents(opt_mode?: ColorMode): ColorComponents4;
	toRgbaObject(): RgbaColorObject;
}

export function equalsColor(v1: Color, v2: Color): boolean {
	if (v1.mode !== v2.mode) {
		return false;
	}
	if (v1.type !== v2.type) {
		return false;
	}

	const comps1 = v1.getComponents();
	const comps2 = v2.getComponents();
	for (let i = 0; i < comps1.length; i++) {
		if (comps1[i] !== comps2[i]) {
			return false;
		}
	}
	return true;
}

export function createColorComponentsFromRgbObject(
	obj: RgbColorObject | RgbaColorObject,
): ColorComponents3 | ColorComponents4 {
	return 'a' in obj ? [obj.r, obj.g, obj.b, obj.a] : [obj.r, obj.g, obj.b];
}
