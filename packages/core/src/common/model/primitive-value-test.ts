import * as assert from 'assert';
import {describe, it} from 'mocha';

import {PrimitiveValue} from './primitive-value.js';

describe(PrimitiveValue.name, () => {
	it('should get raw value', () => {
		const v = new PrimitiveValue(123);
		assert.strictEqual(v.rawValue, 123);
	});

	it('should set raw value', () => {
		const v = new PrimitiveValue(0);
		v.rawValue = 456;
		assert.strictEqual(v.rawValue, 456);
	});

	it('should emit change event', (done) => {
		const v = new PrimitiveValue(1);
		v.emitter.on('change', (ev) => {
			assert.strictEqual(v.rawValue, 2);
			assert.strictEqual(ev.previousRawValue, 1);
			assert.strictEqual(ev.rawValue, 2);
			assert.strictEqual(ev.sender, v);
			done();
		});
		v.rawValue = 2;
	});

	it('should emit beforechange event', (done) => {
		const v = new PrimitiveValue(1);
		let count = 0;

		v.emitter.on('beforechange', (ev) => {
			assert.strictEqual(v.rawValue, 1);
			assert.strictEqual(ev.sender, v);
			assert.strictEqual(count, 0);
			count += 1;
		});
		v.emitter.on('change', () => {
			assert.strictEqual(count, 1);
			done();
		});

		v.rawValue = 2;
	});
});
