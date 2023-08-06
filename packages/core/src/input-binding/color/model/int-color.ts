import {Color, RgbaColorObject} from './color.js';
import {
	appendAlphaComponent,
	ColorComponents3,
	ColorComponents4,
	ColorMode,
	ColorType,
	constrainColorComponents,
	convertColor,
	removeAlphaComponent,
} from './color-model.js';

export class IntColor implements Color {
	public static black(): IntColor {
		return new IntColor([0, 0, 0], 'rgb');
	}

	private readonly comps_: ColorComponents4;
	public readonly mode: ColorMode;
	public readonly type: ColorType = 'int';

	constructor(comps: ColorComponents3 | ColorComponents4, mode: ColorMode) {
		this.mode = mode;
		this.comps_ = constrainColorComponents(comps, mode, this.type);
	}

	public getComponents(opt_mode?: ColorMode): ColorComponents4 {
		return appendAlphaComponent(
			convertColor(
				removeAlphaComponent(this.comps_),
				{mode: this.mode, type: this.type},
				{mode: opt_mode ?? this.mode, type: this.type},
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
