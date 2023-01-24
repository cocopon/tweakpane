import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadonlyValue} from './readonly-value';
import {createValue} from './values';

describe(ReadonlyValue.name, () => {
	it('should get emitter of value', () => {
		const v = createValue(0);
		const [rv] = ReadonlyValue.create(v);
		assert.strictEqual(rv.emitter, v.emitter);
	});

	it('should get raw value', () => {
		const v = createValue(123);
		const [rv] = ReadonlyValue.create(v);
		assert.strictEqual(rv.rawValue, v.rawValue);

		v.rawValue = 456;
		assert.strictEqual(rv.rawValue, v.rawValue);
	});

	it('should set raw value', () => {
		const v = createValue(123);
		const [rv, setRawValue] = ReadonlyValue.create(v);
		assert.strictEqual(rv.rawValue, v.rawValue);

		setRawValue(456);
		assert.strictEqual(rv.rawValue, v.rawValue);
	});
});
