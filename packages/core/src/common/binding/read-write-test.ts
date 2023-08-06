import * as assert from 'assert';
import {describe, it} from 'mocha';

import {numberFromUnknown} from '../converter/number.js';
import {writePrimitive} from '../primitive.js';
import {ReadWriteBinding} from './read-write.js';
import {BindingTarget} from './target.js';

describe(ReadWriteBinding.name, () => {
	it('should read value', () => {
		const obj = {
			foo: 123,
		};
		const target = new BindingTarget(obj, 'foo');
		const b = new ReadWriteBinding({
			reader: numberFromUnknown,
			target: target,
			writer: (v) => v,
		});

		assert.strictEqual(b.read(), 123);
	});

	it('should write value', () => {
		const obj = {
			foo: 123,
		};
		const target = new BindingTarget(obj, 'foo');
		const b = new ReadWriteBinding({
			reader: numberFromUnknown,
			target: target,
			writer: writePrimitive,
		});
		b.write(456);

		assert.strictEqual(obj.foo, 456);
	});
});
