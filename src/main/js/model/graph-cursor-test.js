// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import GraphCursor from './graph-cursor';

describe(GraphCursor.name, () => {
	it('should get index', () => {
		const c = new GraphCursor();
		c.index = 123;
		assert.strictEqual(c.index, 123);
	});

	it('should emit change event', (done) => {
		const c = new GraphCursor();
		c.emitter.on('change', (index) => {
			assert.strictEqual(index, 123);
			done();
		});
		c.index = 123;
	});

	it('should not emit change event for setting same index', () => {
		const c = new GraphCursor();
		c.index = 123;
		c.emitter.on('change', () => {
			throw new Error();
		});
		c.index = 123;
	});
});
