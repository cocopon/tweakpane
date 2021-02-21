import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {IntervalTicker} from './interval';

describe(IntervalTicker.name, () => {
	it('should not create timer for negative interval', (done) => {
		const doc = TestUtil.createWindow().document;

		const t0 = new IntervalTicker(doc, 0);
		t0.emitter.on('tick', () => {
			throw new Error('should not be called');
		});
		const tn = new IntervalTicker(doc, -100);
		tn.emitter.on('tick', () => {
			throw new Error('should not be called');
		});

		setTimeout(() => {
			done();
		}, 10);
	});
});
