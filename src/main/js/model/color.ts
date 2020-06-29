import * as ColorModel from '../misc/color-model';
import {
	ColorComponents3,
	ColorComponents4,
	ColorMode,
} from '../misc/color-model';
import {NumberUtil} from '../misc/number-util';
import {TypeUtil} from '../misc/type-util';

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

const CONSTRAINT_MAP: {
	[mode in ColorMode]: (
		comps: ColorComponents3 | ColorComponents4,
	) => ColorComponents4;
} = {
	hsl: (comps) => {
		return [
			NumberUtil.loop(comps[0], 360),
			NumberUtil.constrain(comps[1], 0, 100),
			NumberUtil.constrain(comps[2], 0, 100),
			NumberUtil.constrain(TypeUtil.getOrDefault(comps[3], 1), 0, 1),
		];
	},
	hsv: (comps) => {
		return [
			NumberUtil.loop(comps[0], 360),
			NumberUtil.constrain(comps[1], 0, 100),
			NumberUtil.constrain(comps[2], 0, 100),
			NumberUtil.constrain(TypeUtil.getOrDefault(comps[3], 1), 0, 1),
		];
	},
	rgb: (comps) => {
		return [
			NumberUtil.constrain(comps[0], 0, 255),
			NumberUtil.constrain(comps[1], 0, 255),
			NumberUtil.constrain(comps[2], 0, 255),
			NumberUtil.constrain(TypeUtil.getOrDefault(comps[3], 1), 0, 1),
		];
	},
};

function isRgbColorComponent(obj: any, key: string): boolean {
	if (typeof obj !== 'object' || TypeUtil.isEmpty(obj)) {
		return false;
	}
	return key in obj && typeof obj[key] === 'number';
}

/**
 * @hidden
 */
export class Color {
	public static fromObject(obj: RgbColorObject | RgbaColorObject): Color {
		const comps: ColorComponents4 | ColorComponents3 =
			'a' in obj ? [obj.r, obj.g, obj.b, obj.a] : [obj.r, obj.g, obj.b];
		return new Color(comps, 'rgb');
	}

	public static toRgbaObject(color: Color): RgbaColorObject {
		return color.toRgbaObject();
	}

	public static isRgbColorObject(obj: any): obj is RgbColorObject {
		return (
			isRgbColorComponent(obj, 'r') &&
			isRgbColorComponent(obj, 'g') &&
			isRgbColorComponent(obj, 'b')
		);
	}

	public static isRgbaColorObject(obj: any): obj is RgbaColorObject {
		return this.isRgbColorObject(obj) && isRgbColorComponent(obj, 'a');
	}

	public static isColorObject(
		obj: any,
	): obj is RgbColorObject | RgbaColorObject {
		return this.isRgbColorObject(obj);
	}

	private comps_: ColorComponents4;
	private mode_: ColorMode;

	constructor(comps: ColorComponents3 | ColorComponents4, mode: ColorMode) {
		this.mode_ = mode;
		this.comps_ = CONSTRAINT_MAP[mode](comps);
	}

	public get mode(): ColorMode {
		return this.mode_;
	}

	public getComponents(opt_mode?: ColorMode): ColorComponents4 {
		return ColorModel.withAlpha(
			ColorModel.convertMode(
				ColorModel.withoutAlpha(this.comps_),
				this.mode_,
				opt_mode || this.mode_,
			),
			this.comps_[3],
		);
	}

	public toRgbaObject(): RgbaColorObject {
		const rgbComps = this.getComponents('rgb');

		// tslint:disable:object-literal-sort-keys
		return {
			r: rgbComps[0],
			g: rgbComps[1],
			b: rgbComps[2],
			a: rgbComps[3],
		};
		// tslint:enable:object-literal-sort-keys
	}
}
