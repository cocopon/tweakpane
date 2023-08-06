import {isEmpty} from '../../misc/type-util.js';
import {ValueMap} from '../model/value-map.js';
import {Constraint} from './constraint.js';

interface Config {
	max?: number;
	min?: number;
}

/**
 * A number range constraint.
 */
export class RangeConstraint implements Constraint<number> {
	public readonly values: ValueMap<{
		max: number | undefined;
		min: number | undefined;
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

		let result = value;
		if (!isEmpty(min)) {
			result = Math.max(result, min);
		}
		if (!isEmpty(max)) {
			result = Math.min(result, max);
		}
		return result;
	}
}
