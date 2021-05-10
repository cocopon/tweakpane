import * as assert from 'assert';
import {describe, it} from 'mocha';

import {GraphCursor} from './graph-cursor';

describe(GraphCursor.name, () => {
	it('should get index', () => {
		const c = new GraphCursor();
		c.index = 123;
		assert.strictEqual(c.index, 123);
	});

	it('should emit change event', (done) => {
		const c = new GraphCursor();
		c.emitter.on('change', (ev) => {
			assert.strictEqual(ev.index, 123);
			done();
		});
		c.index = 123;
	});

	it('should not emit change event for setting same index', () => {
		const c = new GraphCursor();
		c.index = 123;
		c.emitter.on('change', () => {
			assert.fail();
		});
		c.index = 123;
	});
});
