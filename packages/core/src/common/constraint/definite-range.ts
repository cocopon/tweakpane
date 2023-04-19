import {ValueMap} from '../model/value-map.js';
import {Constraint} from './constraint.js';

interface Config {
	max: number;
	min: number;
}

/**
 * A number range constraint that cannot be undefined. Used for slider control.
 */
export class DefiniteRangeConstraint implements Constraint<number> {
	public readonly values: ValueMap<{
		max: number;
		min: number;
	}>;

	constructor(config: Config) {
		this.values = ValueMap.fromObject({
			max: config.max,
			min: config.min,
		});
	}

	public constrain(value: number): number {
		const max = this.values.get('max');
		const min = this.values.get('min');
		return Math.min(Math.max(value, min), max);
	}
}
