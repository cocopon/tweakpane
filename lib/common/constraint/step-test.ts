import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {StepConstraint} from './step';

const DELTA = 1e-5;

describe(StepConstraint.name, () => {
	it('should constrain value with step', () => {
		const c = new StepConstraint(1);
		assert.ok(TestUtil.closeTo(c.constrain(-0.51), -1, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(-0.5), -1, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(-0.49), 0, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(0), 0, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(1.49), 1, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(1.5), 2, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(1.51), 2, DELTA));
	});

	it('should constrain value with decimal step', () => {
		const c = new StepConstraint(0.2);
		assert.ok(TestUtil.closeTo(c.constrain(-1.51), -1.6, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(-1.5), -1.6, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(-1.49), -1.4, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(0), 0, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(1.49), 1.4, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(1.5), 1.6, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(1.51), 1.6, DELTA));
	});

	it('should get step', () => {
		const c = new StepConstraint(0.2);
		assert.strictEqual(c.step, 0.2);
	});
});
