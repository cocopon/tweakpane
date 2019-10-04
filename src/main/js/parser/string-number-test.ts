import {assert} from 'chai';
import {describe, it} from 'mocha';

import StringNumberParser from './string-number';

describe(StringNumberParser.name, () => {
	it('should parse number', () => {
		assert.strictEqual(StringNumberParser('3.14'), 3.14);
		assert.strictEqual(StringNumberParser('abc'), null);
		assert.strictEqual(StringNumberParser('1e-3'), 0.001);
	});
});
