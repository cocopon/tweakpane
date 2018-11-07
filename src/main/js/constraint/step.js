// @flow

import type {Constraint} from './constraint';

type Config = {
	step: number,
};

export default class StepConstraint implements Constraint<number> {
	step_: number;

	constructor(config: Config) {
		this.step_ = config.step;
	}

	get step(): number {
		return this.step_;
	}

	constrain(value: number): number {
		const r = (value < 0) ?
			-Math.round(-value / this.step_) :
			Math.round(value / this.step_);
		return r * this.step_;
	}
}
