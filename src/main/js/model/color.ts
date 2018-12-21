// @flow

import Emitter from '../misc/emitter';
import NumberUtil from '../misc/number-util';

type EventType = 'change';

interface ColorObject {
	r: number;
	g: number;
	b: number;
}

function constrainComponent(comp: number): number {
	return NumberUtil.constrain(comp, 0, 255);
}

export default class Color {
	public readonly emitter: Emitter<EventType>;
	private comps_: [number, number, number];

	constructor(r: number, g: number, b: number) {
		this.emitter = new Emitter();

		this.comps_ = [
			constrainComponent(r),
			constrainComponent(g),
			constrainComponent(b),
		];
	}

	public getComponents(): [number, number, number] {
		return this.comps_;
	}

	public toObject(): ColorObject {
		// tslint:disable:object-literal-sort-keys
		return {
			r: this.comps_[0],
			g: this.comps_[1],
			b: this.comps_[2],
		};
		// tslint:enable:object-literal-sort-keys
	}
}
