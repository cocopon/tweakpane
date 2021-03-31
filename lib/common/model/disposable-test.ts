import * as assert from 'assert';
import {describe, it} from 'mocha';

import {Disposable} from './disposable';

describe(Disposable.name, () => {
	it('should get initial disposed', () => {
		const d = new Disposable();
		assert.strictEqual(d.disposed, false);
	});

	it('should dispose', () => {
		const d = new Disposable();
		d.dispose();
		assert.strictEqual(d.disposed, true);
	});

	it('should emit dispose event', (done) => {
		const d = new Disposable();
		d.emitter.on('dispose', () => {
			done();
		});
		d.dispose();
	});

	it('should not be disposed twice', () => {
		const d = new Disposable();
		assert.strictEqual(d.dispose(), true);
		assert.strictEqual(d.dispose(), false);
	});
});
