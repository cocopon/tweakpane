import * as assert from 'assert';
import {describe, it} from 'mocha';

import {CompositeConstraint, findConstraint} from './composite';
import {Constraint} from './constraint';
import {ListConstraint} from './list';
import {RangeConstraint} from './range';
import {StepConstraint} from './step';

class DoubleConstraint implements Constraint<number> {
	public constrain(value: number): number {
		return value * 2;
	}
}

class DecrementConstraint implements Constraint<number> {
	public constrain(value: number): number {
		return value - 1;
	}
}

describe(CompositeConstraint.name, () => {
	it('should get sub constraints', () => {
		const sc1 = new DoubleConstraint();
		const sc2 = new DecrementConstraint();
		const c = new CompositeConstraint([sc1, sc2]);

		assert.deepStrictEqual(c.constraints, [sc1, sc2]);
	});

	it('should constrain value', () => {
		const c = new CompositeConstraint([
			new DoubleConstraint(),
			new DecrementConstraint(),
		]);
		assert.strictEqual(c.constrain(5), 2 * 5 - 1);
		assert.strictEqual(c.constrain(10), 2 * 10 - 1);
	});

	it('should find constraint itself', () => {
		const c = new RangeConstraint({});
		assert.strictEqual(findConstraint(c, RangeConstraint), c);
		assert.strictEqual(findConstraint(c, StepConstraint), null);
	});

	it('should find sub constraint', () => {
		const rc = new RangeConstraint({});
		const sc = new StepConstraint(1);
		const c = new CompositeConstraint([rc, sc]);
		assert.strictEqual(findConstraint(c, RangeConstraint), rc);
		assert.strictEqual(findConstraint(c, StepConstraint), sc);
		assert.strictEqual(findConstraint(c, ListConstraint), null);
	});
});
