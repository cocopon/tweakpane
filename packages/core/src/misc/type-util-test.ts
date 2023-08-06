import * as assert from 'assert';
import {describe, it} from 'mocha';

import {deepEqualsArray, deepMerge, isPropertyWritable} from './type-util.js';

describe(deepEqualsArray.name, () => {
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
		describe(`when ${JSON.stringify(params)}`, () => {
			it('should compare array deeply', () => {
				assert.strictEqual(deepEqualsArray(params.a1, params.a2), expected);
			});
		});
	});
});

describe(isPropertyWritable.name, () => {
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

describe(deepMerge.name, () => {
	[
		{
			params: {
				obj1: {
					foo: {bar: 1},
				},
				obj2: {
					foo: {baz: 2},
				},
			},
			expected: {
				foo: {bar: 1, baz: 2},
			},
		},
		{
			params: {
				obj1: {foo: 1},
				obj2: {bar: 2},
			},
			expected: {foo: 1, bar: 2},
		},
		{
			params: {
				obj1: {foo: 1},
				obj2: {foo: 2, bar: 3},
			},
			expected: {foo: 2, bar: 3},
		},
		{
			params: {
				obj1: {foo: 1},
				obj2: {foo: null},
			},
			expected: {foo: null},
		},
		{
			params: {
				obj1: {foo: 1},
				obj2: {foo: undefined},
			},
			expected: {foo: undefined},
		},
	].forEach(({params, expected}) => {
		describe(`when params=${JSON.stringify(params)}`, () => {
			it('should merge object deeply', () => {
				assert.deepStrictEqual(deepMerge(params.obj1, params.obj2), expected);
			});
		});
	});
});
