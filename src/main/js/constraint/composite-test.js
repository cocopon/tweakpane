// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import CompositeConstraint from './composite';

import type {Constraint} from './constraint';

class DoubleConstraint implements Constraint<number> {
	constrain(value: number): number {
		return value * 2;
	}
}

class DecrementConstraint implements Constraint<number> {
	constrain(value: number): number {
		return value - 1;
	}
}

describe(CompositeConstraint.name, () => {
	it('should get sub constraints', () => {
		const sc1 = new DoubleConstraint();
		const sc2 = new DecrementConstraint();
		const c = new CompositeConstraint({
			constraints: [sc1, sc2],
		});

		assert.deepEqual(
			c.constraints,
			[sc1, sc2],
		);
	});

	it('should constrain value', () => {
		const c = new CompositeConstraint({
			constraints: [
				new DoubleConstraint(),
				new DecrementConstraint(),
			],
		});
		assert.strictEqual(
			c.constrain(5),
			2 * 5 - 1,
		);
		assert.strictEqual(
			c.constrain(10),
			2 * 10 - 1,
		);
	});
});
