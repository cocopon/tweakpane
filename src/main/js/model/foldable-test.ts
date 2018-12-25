import {assert} from 'chai';
import {describe, it} from 'mocha';

import Foldable from './foldable';

describe(Foldable.name, () => {
	it('should get initial expanded', () => {
		const f = new Foldable();
		assert.strictEqual(f.expanded, false);
	});

	it('should set expanded', () => {
		const f = new Foldable();
		f.expanded = true;
		assert.strictEqual(f.expanded, true);
	});

	it('should emit change event', (done) => {
		const f = new Foldable();
		f.emitter.on('change', () => {
			done();
		});
		f.expanded = true;
	});

	it('should not emit change event for no changes', () => {
		const f = new Foldable();
		f.expanded = true;

		f.emitter.on('change', () => {
			throw new Error('should not be called');
		});
		f.expanded = true;
	});
});
