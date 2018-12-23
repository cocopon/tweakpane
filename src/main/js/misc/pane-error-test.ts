import {assert} from 'chai';
import {describe, it} from 'mocha';

import PaneError from './pane-error';

describe(PaneError.name, () => {
	it('should instanciate for invalid parameters', () => {
		const e = new PaneError({
			context: {
				name: 'foo',
			},
			type: 'invalidparams',
		});

		assert.strictEqual(e.type, 'invalidparams');
	});

	it('should instanciate for no matching controller', () => {
		const e = new PaneError({
			context: {
				key: 'foo',
			},
			type: 'nomatchingcontroller',
		});

		assert.strictEqual(e.type, 'nomatchingcontroller');
	});
});
