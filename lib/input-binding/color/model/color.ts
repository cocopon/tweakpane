import {constrainRange, loopRange} from '../../../common/number-util';
import {isEmpty} from '../../../misc/type-util';
import {
	appendAlphaComponent,
	ColorComponents3,
	ColorComponents4,
	ColorMode,
	convertColorMode,
	removeAlphaComponent,
} from './color-model';

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
			loopRange(comps[0], 360),
			constrainRange(comps[1], 0, 100),
			constrainRange(comps[2], 0, 100),
			constrainRange(comps[3] ?? 1, 0, 1),
		];
	},
	hsv: (comps) => {
		return [
			loopRange(comps[0], 360),
			constrainRange(comps[1], 0, 100),
			constrainRange(comps[2], 0, 100),
			constrainRange(comps[3] ?? 1, 0, 1),
		];
	},
	rgb: (comps) => {
		return [
			constrainRange(comps[0], 0, 255),
			constrainRange(comps[1], 0, 255),
			constrainRange(comps[2], 0, 255),
			constrainRange(comps[3] ?? 1, 0, 1),
		];
	},
};

function isRgbColorComponent(obj: any, key: string): boolean {
	if (typeof obj !== 'object' || isEmpty(obj)) {
		return false;
	}
	return key in obj && typeof obj[key] === 'number';
}

/**
 * @hidden
 */
export class Color {
	public static black(): Color {
		return new Color([0, 0, 0], 'rgb');
	}

	public static fromObject(obj: RgbColorObject | RgbaColorObject): Color {
		const comps: ColorComponents4 | ColorComponents3 =
			'a' in obj ? [obj.r, obj.g, obj.b, obj.a] : [obj.r, obj.g, obj.b];
		return new Color(comps, 'rgb');
	}

	public static toRgbaObject(color: Color): RgbaColorObject {
		return color.toRgbaObject();
	}

	public static isRgbColorObject(obj: unknown): obj is RgbColorObject {
		return (
			isRgbColorComponent(obj, 'r') &&
			isRgbColorComponent(obj, 'g') &&
			isRgbColorComponent(obj, 'b')
		);
	}

	public static isRgbaColorObject(obj: unknown): obj is RgbaColorObject {
		return this.isRgbColorObject(obj) && isRgbColorComponent(obj, 'a');
	}

	public static isColorObject(
		obj: unknown,
	): obj is RgbColorObject | RgbaColorObject {
		return this.isRgbColorObject(obj);
	}

	public static equals(v1: Color, v2: Color): boolean {
		if (v1.mode_ !== v2.mode_) {
			return false;
		}

		const comps1 = v1.comps_;
		const comps2 = v2.comps_;
		for (let i = 0; i < comps1.length; i++) {
			if (comps1[i] !== comps2[i]) {
				return false;
			}
		}
		return true;
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
		return appendAlphaComponent(
			convertColorMode(
				removeAlphaComponent(this.comps_),
				this.mode_,
				opt_mode || this.mode_,
			),
			this.comps_[3],
		);
	}

	public toRgbaObject(): RgbaColorObject {
		const rgbComps = this.getComponents('rgb');
		return {
			r: rgbComps[0],
			g: rgbComps[1],
			b: rgbComps[2],
			a: rgbComps[3],
		};
	}
}
