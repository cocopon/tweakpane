import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {TextController} from '../../input-bindings/common/controller/text';
import {InputBinding} from '../binding/input';
import {Target} from '../model/target';
import {Value} from '../model/value';
import {ViewModel} from '../model/view-model';
import {numberFromUnknown} from '../reader/number';
import {StringNumberParser} from '../reader/string-number';
import {NumberFormatter} from '../writer/number';
import {InputBindingController} from './input-binding';

describe(InputBindingController.name, () => {
	it('should get properties', () => {
		const obj = {
			foo: 123,
		};
		const doc = TestUtil.createWindow().document;
		const value = new Value(0);
		const binding = new InputBinding({
			reader: numberFromUnknown,
			target: new Target(obj, 'foo'),
			value: value,
			writer: (v) => v,
		});
		const controller = new TextController(doc, {
			viewModel: new ViewModel(),
			formatter: new NumberFormatter(0),
			parser: StringNumberParser,
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
