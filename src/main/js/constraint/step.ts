import {Constraint} from './constraint';

interface Config {
	step: number;
}

/**
 * @hidden
 */
export class StepConstraint implements Constraint<number> {
	public readonly step: number;

	constructor(config: Config) {
		this.step = config.step;
	}

	public constrain(value: number): number {
		const r =
			value < 0
				? -Math.round(-value / this.step)
				: Math.round(value / this.step);
		return r * this.step;
	}
}
