import {Class} from '../../misc/type-util';
import {Constraint} from './constraint';

/**
 * A constraint to combine multiple constraints.
 * @template T The type of the value.
 */
export class CompositeConstraint<T> implements Constraint<T> {
	public readonly constraints: Constraint<T>[];

	constructor(constraints: Constraint<T>[]) {
		this.constraints = constraints;
	}

	public constrain(value: T): T {
		return this.constraints.reduce((result, c) => {
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
