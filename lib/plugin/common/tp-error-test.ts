import * as assert from 'assert';
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
});
