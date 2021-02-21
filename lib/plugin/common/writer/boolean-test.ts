import {assert} from 'chai';
import {describe, it} from 'mocha';

import {boolToString} from './boolean';

describe('booleanConverter', () => {
	it('should convert boolean to string', () => {
		assert.strictEqual(boolToString(true), 'true');
		assert.strictEqual(boolToString(false), 'false');
	});
});
