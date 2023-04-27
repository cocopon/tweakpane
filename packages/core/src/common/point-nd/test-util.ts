import {findConstraint} from '../constraint/composite.js';
import {Constraint} from '../constraint/constraint.js';
import {DefiniteRangeConstraint} from '../constraint/definite-range.js';
import {RangeConstraint} from '../constraint/range.js';
import {StepConstraint} from '../constraint/step.js';

/**
 * Finds a range from number constraint.
 * @param c The number constraint.
 * @return A list that contains a minimum value and a max value.
 */
function findNumberRange(
	c: Constraint<number>,
): [number | undefined, number | undefined] {
	const drc = findConstraint(c, DefiniteRangeConstraint);
	if (drc) {
		return [drc.values.get('min'), drc.values.get('max')];
	}
	const rc = findConstraint(c, RangeConstraint);
	if (rc) {
		return [rc.values.get('min'), rc.values.get('max')];
	}
	return [undefined, undefined];
}

export function getDimensionProps(c: Constraint<number>) {
	const [min, max] = findNumberRange(c);
	const sc = findConstraint(c, StepConstraint);
	return {
		max: max,
		min: min,
		step: sc?.step,
	};
}
