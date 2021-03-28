import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from './target';

describe(BindingTarget.name, () => {
	it('should get properties', () => {
		const obj = {foo: 'bar'};
		const target = new BindingTarget(obj, 'foo');
		assert.strictEqual(target.key, 'foo');
		assert.strictEqual(target.presetKey, 'foo');
	});

	it('should specify preset key', () => {
		const obj = {foo: 'bar'};
		const target = new BindingTarget(obj, 'foo', 'baz');
		assert.strictEqual(target.presetKey, 'baz');
	});

	it('should read value', () => {
		const obj = {foo: 'bar'};
		const target = new BindingTarget(obj, 'foo');
		assert.strictEqual(target.read(), 'bar');
	});

	it('should write value', () => {
		const obj = {foo: 'bar'};
		const target = new BindingTarget(obj, 'foo');
		target.write('wrote');
		assert.strictEqual(obj.foo, 'wrote');
	});
});
