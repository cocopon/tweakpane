import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {deepEqualsArray, isPropertyWritable} from './type-util';

describe('TypeUtil', () => {
	[
		{
			expected: true,
			params: {
				a1: [1, 2, 3],
				a2: [1, 2, 3],
			},
		},
		{
			expected: false,
			params: {
				a1: [1, 2, 3],
				a2: [1, 4, 3],
			},
		},
		{
			expected: false,
			params: {
				a1: [1, 2],
				a2: [1, 2, 3],
			},
		},
		{
			expected: false,
			params: {
				a1: [1, 2, 3],
				a2: [1, 2],
			},
		},
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should compare array deeply', () => {
				assert.strictEqual(deepEqualsArray(params.a1, params.a2), expected);
			});
		});
	});

	it('should detect setter of plain object', () => {
		const obj = {foo: 0};
		assert.strictEqual(isPropertyWritable(obj, 'foo'), true);
	});

	it('should detect setter of instance', () => {
		class WithSetter {
			private value_ = 0;

			get foo() {
				return this.value_;
			}

			set foo(value: number) {
				this.value_ = value;
			}
		}
		const ws = new WithSetter();
		assert.strictEqual(isPropertyWritable(ws, 'foo'), true);
	});

	it('should detect parent setter of instance', () => {
		class Parent {
			private value_ = 0;

			get foo() {
				return this.value_;
			}

			set foo(value: number) {
				this.value_ = value;
			}
		}
		class Child extends Parent {}
		const c = new Child();
		assert.strictEqual(isPropertyWritable(c, 'foo'), true);
	});

	it('should not detect getter of instance as setter', () => {
		class WithoutSetter {
			private value_ = 0;

			get foo() {
				return this.value_;
			}
		}
		const wos = new WithoutSetter();
		assert.strictEqual(isPropertyWritable(wos, 'foo'), false);
	});
});
