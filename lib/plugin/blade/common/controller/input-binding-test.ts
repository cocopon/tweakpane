import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {InputBinding} from '../../../common/binding/input';
import {Target} from '../../../common/model/target';
import {Value} from '../../../common/model/value';
import {numberFromUnknown} from '../../../common/reader/number';
import {StringNumberParser} from '../../../common/reader/string-number';
import {NumberFormatter} from '../../../common/writer/number';
import {TextController} from '../../../input-bindings/common/controller/text';
import {Blade} from '../model/blade';
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
			formatter: new NumberFormatter(0),
			parser: StringNumberParser,
			value: value,
		});
		const bc = new InputBindingController(doc, {
			binding: binding,
			controller: controller,
			label: 'foo',
			blade: new Blade(),
		});
		assert.strictEqual(bc.binding, binding);
		assert.strictEqual(bc.controller, controller);
		assert.strictEqual(bc.view.label, 'foo');
	});
});
