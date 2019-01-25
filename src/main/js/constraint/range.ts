import {Constraint} from './constraint';

interface Config {
	max?: number;
	min?: number;
}

/**
 * @hidden
 */
export default class RangeConstraint implements Constraint<number> {
	private max_: number | undefined;
	private min_: number | undefined;

	constructor(config: Config) {
		this.max_ = config.max;
		this.min_ = config.min;
	}

	get minValue(): number | undefined {
		return this.min_;
	}

	get maxValue(): number | undefined {
		return this.max_;
	}

	public constrain(value: number): number {
		let result = value;
		if (this.min_ !== null && this.min_ !== undefined) {
			result = Math.max(result, this.min_);
		}
		if (this.max_ !== null && this.max_ !== undefined) {
			result = Math.min(result, this.max_);
		}
		return result;
	}
}
