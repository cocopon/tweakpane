import * as assert from 'assert';
import {describe, it} from 'mocha';

import {PrimitiveValue} from '../model/primitive-value';
import {Binding} from './binding';
import {BindingTarget} from './target';
import {BindingValue} from './value';

describe(BindingValue.name, () => {
	it('should apply rawValue to target', () => {
		const iv = new PrimitiveValue(0);
		const target = new BindingTarget({foo: 0}, 'foo');
		const bv = new BindingValue(
			iv,
			new Binding({
				reader: (v: unknown) => Number(v),
				writer: (t, v) => t.write(v),
				target: target,
			}),
		);

		bv.rawValue = 1;
		assert.strictEqual(target.read(), 1);
	});

	it('should have its own sender', (done) => {
		const iv = new PrimitiveValue(0);
		const bv = new BindingValue(
			iv,
			new Binding({
				reader: (v: unknown) => Number(v),
				writer: (t, v) => t.write(v),
				target: new BindingTarget({foo: 0}, 'foo'),
			}),
		);
		bv.emitter.on('change', (ev) => {
			assert.strictEqual(ev.sender, bv);
			done();
		});
		iv.rawValue = 1;
	});
});
