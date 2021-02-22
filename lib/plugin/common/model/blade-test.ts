import {assert} from 'chai';
import {describe, it} from 'mocha';

import {Blade} from './blade';

describe(Blade.name, () => {
	it('should be shown by default', () => {
		const b = new Blade();
		assert.strictEqual(b.hidden, false);
	});

	it('should emit change event for hidden', (done) => {
		const b = new Blade();
		b.emitter.on('change', (ev) => {
			assert.strictEqual(ev.propertyName, 'hidden');
			assert.strictEqual(b.hidden, true);
			done();
		});
		b.hidden = true;
	});

	it('should not emit change event by setting hidden to same value', () => {
		const b = new Blade();
		b.emitter.on('change', () => {
			throw new Error('should not be called');
		});
		b.hidden = false;
	});
});
