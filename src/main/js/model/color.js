// @flow

import Emitter from '../misc/emitter';
import NumberUtil from '../misc/number-util';

type EventType = 'change';

type ColorObject = {
	r: number,
	g: number,
	b: number,
};

function constrainComponent(comp: number): number {
	return NumberUtil.constrain(comp, 0, 255);
}

export default class Color {
	+emitter: Emitter<EventType>;
	comps_: [number, number, number];

	constructor(r: number, g: number, b: number) {
		this.emitter = new Emitter();

		this.comps_ = [
			constrainComponent(r),
			constrainComponent(g),
			constrainComponent(b),
		];
	}

	getComponents(): [number, number, number] {
		return this.comps_;
	}

	toObject(): ColorObject {
		return {
			r: this.comps_[0],
			g: this.comps_[1],
			b: this.comps_[2],
		};
	}
}
