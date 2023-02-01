import * as assert from 'assert';
import {describe, it} from 'mocha';

import {numberFromUnknown} from '../converter/number';
import {writePrimitive} from '../primitive';
import {BindingTarget} from './target';
import {WritableBinding} from './writable';

describe(WritableBinding.name, () => {
	it('should read value', () => {
		const obj = {
			foo: 123,
		};
		const target = new BindingTarget(obj, 'foo');
		const b = new WritableBinding({
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
		const b = new WritableBinding({
			reader: numberFromUnknown,
			target: target,
			writer: writePrimitive,
		});
		b.write(456);

		assert.strictEqual(obj.foo, 456);
	});
});
