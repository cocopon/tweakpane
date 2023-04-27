import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from './target.js';

describe(BindingTarget.name, () => {
	it('should get properties', () => {
		const obj = {foo: 'bar'};
		const target = new BindingTarget(obj, 'foo');
		assert.strictEqual(target.key, 'foo');
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

	it('should bind static class field', () => {
		class Test {
			static foo = 1;
		}

		assert.doesNotThrow(() => {
			new BindingTarget(Test, 'foo');
		});
	});

	it('should determine class is bindable', () => {
		class Test {
			static foo = 1;
		}

		assert.strictEqual(BindingTarget.isBindable(Test), true);
	});
});
