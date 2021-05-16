import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../../../misc/dom-test-util';
import {IntervalTicker} from './interval';

describe(IntervalTicker.name, () => {
	it('should not create timer for negative interval', (done) => {
		const doc = createTestWindow().document;

		const t0 = new IntervalTicker(doc, 0);
		t0.emitter.on('tick', () => {
			assert.fail('should not be called');
		});
		const tn = new IntervalTicker(doc, -100);
		tn.emitter.on('tick', () => {
			assert.fail('should not be called');
		});

		setTimeout(() => {
			done();
		}, 10);
	});

	it('should tick', (done) => {
		const doc = createTestWindow().document;
		const t = new IntervalTicker(doc, 1);

		t.emitter.on('tick', () => {
			t.dispose();
			done();
		});
	});

	it('should be enabled by default', () => {
		const doc = createTestWindow().document;
		const t = new IntervalTicker(doc, 0);

		assert.strictEqual(t.disabled, false);
	});

	it('should not tick if disabled', (done) => {
		const doc = createTestWindow().document;
		const t = new IntervalTicker(doc, 1);
		t.disabled = true;
		t.emitter.on('tick', () => {
			assert.fail('should not called');
		});

		setTimeout(done, 10);
	});
});
