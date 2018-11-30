// @flow

import CompositeConstraint from './composite';

import type {Constraint} from './constraint';

const ConstraintUtil = {
	findConstraint<C>(c: Constraint<*>, constraintClass: Class<C>): ?C {
		if (c instanceof constraintClass) {
			return c;
		}

		if (c instanceof CompositeConstraint) {
			const result = c.constraints.reduce((result, sc) => {
				if (result) {
					return result;
				}

				return sc instanceof constraintClass ? sc : null;
			}, null);
			if (result) {
				return result;
			}
		}

		return null;
	},
};

export default ConstraintUtil;
