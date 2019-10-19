import {assert} from 'chai';
import {describe, it} from 'mocha';

import {StepConstraint} from './step';

const DELTA = 1e-5;

describe(StepConstraint.name, () => {
	it('should constrain value with step', () => {
		const c = new StepConstraint({
			step: 1,
		});
		assert.closeTo(c.constrain(-0.51), -1, DELTA);
		assert.closeTo(c.constrain(-0.5), -1, DELTA);
		assert.closeTo(c.constrain(-0.49), 0, DELTA);
		assert.closeTo(c.constrain(0), 0, DELTA);
		assert.closeTo(c.constrain(1.49), 1, DELTA);
		assert.closeTo(c.constrain(1.5), 2, DELTA);
		assert.closeTo(c.constrain(1.51), 2, DELTA);
	});

	it('should constrain value with decimal step', () => {
		const c = new StepConstraint({
			step: 0.2,
		});
		assert.closeTo(c.constrain(-1.51), -1.6, DELTA);
		assert.closeTo(c.constrain(-1.5), -1.6, DELTA);
		assert.closeTo(c.constrain(-1.49), -1.4, DELTA);
		assert.closeTo(c.constrain(0), 0, DELTA);
		assert.closeTo(c.constrain(1.49), 1.4, DELTA);
		assert.closeTo(c.constrain(1.5), 1.6, DELTA);
		assert.closeTo(c.constrain(1.51), 1.6, DELTA);
	});

	it('should get step', () => {
		const c = new StepConstraint({
			step: 0.2,
		});
		assert.strictEqual(c.step, 0.2);
	});
});
