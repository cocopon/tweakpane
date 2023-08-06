import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createReadonlyValue, createValue} from './values.js';

describe(createReadonlyValue.name, () => {
	it('should get raw value', () => {
		const v = createValue(123);
		const [rv] = createReadonlyValue(v);
		assert.strictEqual(rv.rawValue, v.rawValue);

		v.rawValue = 456;
		assert.strictEqual(rv.rawValue, v.rawValue);
	});

	it('should set raw value', () => {
		const v = createValue(123);
		const [rv, setRawValue] = createReadonlyValue(v);
		assert.strictEqual(rv.rawValue, v.rawValue);

		setRawValue(456);
		assert.strictEqual(rv.rawValue, v.rawValue);
	});

	it('should emit beforechange event', (done) => {
		const v = createValue(123);
		const [rv, setRawValue] = createReadonlyValue(v);

		rv.emitter.on('beforechange', (ev) => {
			assert.strictEqual(ev.sender, rv);
			done();
		});
		setRawValue(456);
	});

	it('should emit change event', (done) => {
		const v = createValue(123);
		const [rv, setRawValue] = createReadonlyValue(v);

		rv.emitter.on('change', (ev) => {
			assert.strictEqual(ev.previousRawValue, 123);
			assert.strictEqual(ev.rawValue, 456);
			assert.strictEqual(ev.sender, rv);
			done();
		});
		setRawValue(456);
	});
});
