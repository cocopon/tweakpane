// @flow

import type {Constraint} from './constraint';

type Config = {
	max?: ?number,
	min?: ?number,
};

export default class RangeConstraint implements Constraint<number> {
	max_: ?number;
	min_: ?number;

	constructor(config: Config) {
		this.max_ = config.max;
		this.min_ = config.min;
	}

	get minValue(): ?number {
		return this.min_;
	}

	get maxValue(): ?number {
		return this.max_;
	}

	constrain(value: number): number {
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
