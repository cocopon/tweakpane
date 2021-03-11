import {assert} from 'chai';
import {describe, it} from 'mocha';

import {StepConstraint} from './common/constraint/step';
import {getSuitableDraggingScale} from './util';

const DELTA = 1e-5;

describe(getSuitableDraggingScale.name, () => {
	[
		{
			params: {
				constraint: undefined,
				rawValue: -10,
			},
			expected: 1,
		},
		{
			params: {
				constraint: undefined,
				rawValue: 1,
			},
			expected: 0.1,
		},
		{
			params: {
				constraint: undefined,
				rawValue: 0.02,
			},
			expected: 0.001,
		},
		{
			params: {
				constraint: undefined,
				rawValue: 0,
			},
			expected: 0.1,
		},
		{
			params: {
				constraint: new StepConstraint(1),
				rawValue: 123,
			},
			expected: 0.1,
		},
	].forEach(({params, expected}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should estimate suitable scale', () => {
				assert.closeTo(
					getSuitableDraggingScale(params.constraint, params.rawValue),
					expected,
					DELTA,
				);
			});
		});
	});
});
