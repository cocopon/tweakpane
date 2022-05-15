import {Constraint} from './constraint';

/**
 * A number step range constraint.
 */
export class StepConstraint implements Constraint<number> {
	public readonly step: number;
	public readonly origin: number;

	constructor(step: number, origin = 0) {
		this.step = step;
		this.origin = origin;
	}

	public constrain(value: number): number {
		const o = this.origin % this.step;
		const r = Math.round((value - o) / this.step);
		return o + r * this.step;
	}
}
