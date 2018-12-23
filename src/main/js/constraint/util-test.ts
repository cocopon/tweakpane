import {assert} from 'chai';
import {describe, it} from 'mocha';

import CompositeConstraint from './composite';
import ListConstraint from './list';
import RangeConstraint from './range';
import StepConstraint from './step';
import ConstraintUtil from './util';

describe('ConstraintUtil', () => {
	it('should find constraint itself', () => {
		const c = new RangeConstraint({});
		assert.strictEqual(ConstraintUtil.findConstraint(c, RangeConstraint), c);
		assert.isNull(ConstraintUtil.findConstraint(c, StepConstraint));
	});

	it('should find sub constraint', () => {
		const rc = new RangeConstraint({});
		const sc = new StepConstraint({step: 1});
		const c = new CompositeConstraint({
			constraints: [rc, sc],
		});
		assert.strictEqual(ConstraintUtil.findConstraint(c, RangeConstraint), rc);
		assert.strictEqual(ConstraintUtil.findConstraint(c, StepConstraint), sc);
		assert.isNull(ConstraintUtil.findConstraint(c, ListConstraint));
	});
});
