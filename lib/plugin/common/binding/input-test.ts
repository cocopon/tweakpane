import {assert} from 'chai';
import {describe, it} from 'mocha';

import {Value} from '../model/value';
import {numberFromUnknown} from '../reader/number';
import {writePrimitive} from '../writer/primitive';
import {InputBinding} from './input';
import {BindingTarget} from './target';

describe(InputBinding.name, () => {
	it('should get value', () => {
		const obj = {
			foo: 123,
		};
		const target = new BindingTarget(obj, 'foo');
		const value = new Value(0);
		const b = new InputBinding({
			reader: numberFromUnknown,
			target: target,
			value: value,
			writer: (v) => v,
		});

		assert.strictEqual(b.value, value);
	});

	it('should bind value', () => {
		const obj = {
			foo: 123,
		};
		const target = new BindingTarget(obj, 'foo');
		const value = new Value(0);
		// tslint:disable-next-line:no-unused-expression
		new InputBinding({
			reader: numberFromUnknown,
			target: target,
			value: value,
			writer: writePrimitive,
		});

		assert.strictEqual(
			value.rawValue,
			123,
			'Initial value of target should be applied',
		);

		value.rawValue = 456;

		assert.strictEqual(obj.foo, 456, 'Bound value should be updated');
	});

	it('should not apply binding value to undefined field', () => {
		const obj: {foo?: string} = {};
		const target = new BindingTarget(obj, 'foo');
		const value = new Value(0);
		// tslint:disable-next-line:no-unused-expression
		new InputBinding({
			reader: numberFromUnknown,
			target: target,
			value: value,
			writer: (v) => v,
		});

		assert.isUndefined(obj.foo);
	});
});
