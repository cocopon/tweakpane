import * as assert from 'assert';
import {describe, it} from 'mocha';

import {isRefreshable} from './refreshable.js';

describe(isRefreshable.name, () => {
	it('should determine Refreshable', () => {
		assert.strictEqual(
			isRefreshable({
				refresh: () => {},
			}),
			true,
		);
	});

	it('should not determine variable as Refreshable', () => {
		assert.strictEqual(
			isRefreshable({
				refresh: 1,
			}),
			false,
		);
	});
});
