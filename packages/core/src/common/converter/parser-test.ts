import * as assert from 'assert';
import {describe, it} from 'mocha';

import {composeParsers} from './parser.js';

describe(composeParsers.name, () => {
	it('should use the first parser', () => {
		const p = composeParsers<number>([
			(t) => parseInt(t) * 10,
			(t) => parseInt(t) * 100,
		]);
		assert.strictEqual(p('123'), 1230);
	});

	it('should delegate a value to the next parser', () => {
		const p = composeParsers<number>([(_) => null, (t) => parseInt(t) * 100]);
		assert.strictEqual(p('123'), 12300);
	});
});
