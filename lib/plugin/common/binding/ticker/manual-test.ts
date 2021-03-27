import {assert} from 'chai';
import {describe, it} from 'mocha';

import {ManualTicker} from './manual';

describe(ManualTicker.name, () => {
	it('should be enabled by default', () => {
		const t = new ManualTicker();
		assert.isFalse(t.disabled);
	});

	it('should fire tick event', () => {
		const t = new ManualTicker();
		let count = 0;
		t.emitter.on('tick', () => {
			count += 1;
		});

		assert.strictEqual(count, 0);
		t.tick();
		assert.strictEqual(count, 1);
	});

	it('should not fire tick event from disabled ticker', () => {
		const t = new ManualTicker();
		t.emitter.on('tick', () => {
			throw new Error('should not be called');
		});

		t.disabled = true;
		assert.doesNotThrow(() => {
			t.tick();
		});
	});
});
