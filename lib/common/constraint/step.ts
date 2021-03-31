import {Constraint} from './constraint';

/**
 * A number step range constraint.
 */
export class StepConstraint implements Constraint<number> {
	public readonly step: number;

	constructor(step: number) {
		this.step = step;
	}

	public constrain(value: number): number {
		const r =
			value < 0
				? -Math.round(-value / this.step)
				: Math.round(value / this.step);
		return r * this.step;
	}
}
