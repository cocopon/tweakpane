// @flow

import CompositeConstraint from './composite';

import {Class} from '../misc/flow-util';
import {Constraint} from './constraint';

const ConstraintUtil = {
	findConstraint: <C>(
		c: Constraint<unknown>,
		constraintClass: Class<C>,
	): C | null => {
		if (c instanceof constraintClass) {
			return c;
		}

		if (c instanceof CompositeConstraint) {
			const result = c.constraints.reduce((tmpResult, sc) => {
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
	},
};

export default ConstraintUtil;
