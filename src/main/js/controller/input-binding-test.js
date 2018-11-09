// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import * as NumberConverter from '../converter/number';
import InputBinding from '../binding/input';
import NumberFormatter from '../formatter/number';
import TestUtil from '../misc/test-util';
import InputValue from '../model/input-value';
import Target from '../model/target';
import NumberParser from '../parser/number';
import TextInputController from './input/text';
import InputBindingController from './input-binding';

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
