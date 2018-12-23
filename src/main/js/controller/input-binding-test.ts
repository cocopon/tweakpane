import {assert} from 'chai';
import {describe, it} from 'mocha';

import InputBinding from '../binding/input';
import * as NumberConverter from '../converter/number';
import NumberFormatter from '../formatter/number';
import TestUtil from '../misc/test-util';
import InputValue from '../model/input-value';
import Target from '../model/target';
import NumberParser from '../parser/number';
import InputBindingController from './input-binding';
import TextInputController from './input/text';

describe(InputBindingController.name, () => {
	it('should get properties', () => {
		const obj = {
			foo: 123,
		};
		const doc = TestUtil.createWindow().document;
		const value = new InputValue(0);
		const binding = new InputBinding({
			reader: NumberConverter.fromMixed,
			target: new Target(obj, 'foo'),
			value: value,
			writer: (v) => v,
		});
		const controller = new TextInputController(doc, {
			formatter: new NumberFormatter(0),
			parser: NumberParser,
			value: value,
		});
		const bc = new InputBindingController(doc, {
			binding: binding,
			controller: controller,
			label: 'foo',
		});
		assert.strictEqual(bc.binding, binding);
		assert.strictEqual(bc.controller, controller);
		assert.strictEqual(bc.view.label, 'foo');
	});
});
