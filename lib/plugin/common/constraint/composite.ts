import {Class} from '../../../misc/type-util';
import {Constraint} from './constraint';

interface Config<T> {
	constraints: Constraint<T>[];
}

/**
 * A constraint to combine multiple constraints.
 * @template T The type of the value.
 */
export class CompositeConstraint<T> implements Constraint<T> {
	private constraints_: Constraint<T>[];

	constructor(config: Config<T>) {
		this.constraints_ = config.constraints;
	}

	get constraints(): Constraint<T>[] {
		return this.constraints_;
	}

	public constrain(value: T): T {
		return this.constraints_.reduce((result, c) => {
			return c.constrain(result);
		}, value);
	}
}

export function findConstraint<C>(
	c: Constraint<unknown>,
	constraintClass: Class<C>,
): C | null {
	if (c instanceof constraintClass) {
		return c;
	}

	if (c instanceof CompositeConstraint) {
		const result = c.constraints.reduce((tmpResult: C | null, sc) => {
			if (tmpResult) {
				return tmpResult;
			}

			return sc instanceof constraintClass ? sc : null;
		}, null);
		if (result) {
			return result;
		}
	}

	return null;
}
