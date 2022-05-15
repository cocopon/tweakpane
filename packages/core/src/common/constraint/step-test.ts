import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {StepConstraint} from './step';

const DELTA = 1e-5;

describe(StepConstraint.name, () => {
	it('should constrain value with step', () => {
		const c = new StepConstraint(1);
		assert.ok(TestUtil.closeTo(c.constrain(-0.51), -1, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(-0.49), 0, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(0), 0, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(1.49), 1, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(1.51), 2, DELTA));
	});

	it('should constrain value with decimal step', () => {
		const c = new StepConstraint(0.2);
		assert.ok(TestUtil.closeTo(c.constrain(-1.51), -1.6, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(-1.49), -1.4, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(0), 0, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(1.49), 1.4, DELTA));
		assert.ok(TestUtil.closeTo(c.constrain(1.51), 1.6, DELTA));
	});

	it('should get step', () => {
		const c = new StepConstraint(0.2);
		assert.strictEqual(c.step, 0.2);
	});

	it('should apply origin', () => {
		[
			{params: {step: 2, origin: 1, value: -1}, expected: -1},
			{params: {step: 2, origin: 1, value: -0.1}, expected: -1},
			{params: {step: 2, origin: 1, value: 0.1}, expected: 1},
			{params: {step: 2, origin: 1, value: 1}, expected: 1},
			{params: {step: 2, origin: 1, value: 1.9}, expected: 1},
			{params: {step: 2, origin: 1, value: 2.1}, expected: 3},
			{params: {step: 2, origin: 1, value: 3}, expected: 3},
			// Negative origin
			{params: {step: 2, origin: -123, value: -1}, expected: -1},
			{params: {step: 2, origin: -123, value: 1}, expected: 1},
			{params: {step: 2, origin: -123, value: 3}, expected: 3},
			// Large origin
			{params: {step: 2, origin: 123, value: 1}, expected: 1},
			{params: {step: 2, origin: 123, value: 3}, expected: 3},
		].forEach(({params, expected}) => {
			const c = new StepConstraint(params.step, params.origin);
			assert.strictEqual(
				c.constrain(params.value),
				expected,
				JSON.stringify(params),
			);
		});
	});
});
