import {assert} from 'chai';
import {describe, it} from 'mocha';

import * as NumberConverter from '../converter/number';
import {InputValue} from '../model/input-value';
import {Target} from '../model/target';
import {InputBinding} from './input';

describe(InputBinding.name, () => {
	it('should get value', () => {
		const obj = {
			foo: 123,
		};
		const target = new Target(obj, 'foo');
		const value = new InputValue(0);
		const b = new InputBinding({
			reader: NumberConverter.fromMixed,
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
		const target = new Target(obj, 'foo');
		const value = new InputValue(0);
		// tslint:disable-next-line:no-unused-expression
		new InputBinding({
			reader: NumberConverter.fromMixed,
			target: target,
			value: value,
			writer: (v) => v,
		});

		assert.strictEqual(
			value.rawValue,
			123,
			'Initial value of target should be applied',
		);

		value.rawValue = 456;

		assert.strictEqual(obj.foo, 456, 'Binded value should be updated');
	});

	it('should not apply binding value to undefined field', () => {
		const obj = {};
		const target = new Target(obj, 'foo');
		const value = new InputValue(0);
		// tslint:disable-next-line:no-unused-expression
		new InputBinding({
			reader: NumberConverter.fromMixed,
			target: target,
			value: value,
			writer: (v) => v,
		});

		assert.isUndefined((obj as any).foo);
	});
});
