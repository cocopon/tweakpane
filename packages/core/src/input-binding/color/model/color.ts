import {isEmpty} from '../../../misc/type-util';
import {
	appendAlphaComponent,
	ColorComponents3,
	ColorComponents4,
	ColorMode,
	ColorType,
	constrainColorComponents,
	convertColor,
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

function isRgbColorComponent(obj: any, key: string): boolean {
	if (typeof obj !== 'object' || isEmpty(obj)) {
		return false;
	}
	return key in obj && typeof obj[key] === 'number';
}

// TODO: Make type required in the next major version
/**
 * @hidden
 */
export class Color {
	public static black(type: ColorType = 'int'): Color {
		return new Color([0, 0, 0], 'rgb', type);
	}

	public static fromObject(
		obj: RgbColorObject | RgbaColorObject,
		type: ColorType = 'int',
	): Color {
		const comps: ColorComponents4 | ColorComponents3 =
			'a' in obj ? [obj.r, obj.g, obj.b, obj.a] : [obj.r, obj.g, obj.b];
		return new Color(comps, 'rgb', type);
	}

	public static toRgbaObject(
		color: Color,
		type: ColorType = 'int',
	): RgbaColorObject {
		return color.toRgbaObject(type);
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
		if (v1.mode !== v2.mode) {
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

	private readonly comps_: ColorComponents4;
	public readonly mode: ColorMode;
	public readonly type: ColorType;

	constructor(
		comps: ColorComponents3 | ColorComponents4,
		mode: ColorMode,
		type: ColorType = 'int',
	) {
		this.mode = mode;
		this.type = type;
		this.comps_ = constrainColorComponents(comps, mode, type);
	}

	public getComponents(
		opt_mode?: ColorMode,
		type: ColorType = 'int',
	): ColorComponents4 {
		return appendAlphaComponent(
			convertColor(
				removeAlphaComponent(this.comps_),
				{mode: this.mode, type: this.type},
				{mode: opt_mode ?? this.mode, type},
			),
			this.comps_[3],
		);
	}

	public toRgbaObject(type: ColorType = 'int'): RgbaColorObject {
		const rgbComps = this.getComponents('rgb', type);
		return {
			r: rgbComps[0],
			g: rgbComps[1],
			b: rgbComps[2],
			a: rgbComps[3],
		};
	}
}
