import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TpError} from './tp-error';

describe(TpError.name, () => {
	it('should instanciate for invalid parameters', () => {
		const e = new TpError({
			context: {
				name: 'foo',
			},
			type: 'invalidparams',
		});

		assert.strictEqual(e.type, 'invalidparams');
	});

	it('should instanciate for no matching controller', () => {
		const e = new TpError({
			context: {
				key: 'foo',
			},
			type: 'nomatchingcontroller',
		});

		assert.strictEqual(e.type, 'nomatchingcontroller');
	});

	it('should instanciate for empty value', () => {
		const e = new TpError({
			context: {
				key: 'foo',
			},
			type: 'emptyvalue',
		});

		assert.strictEqual(e.type, 'emptyvalue');
	});
});
