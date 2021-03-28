import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ManualTicker} from './manual';

describe(ManualTicker.name, () => {
	it('should be enabled by default', () => {
		const t = new ManualTicker();
		assert.strictEqual(t.disabled, false);
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
			assert.fail('should not be called');
		});

		t.disabled = true;
		assert.doesNotThrow(() => {
			t.tick();
		});
	});
});
