import {assert} from 'chai';
import {describe, it} from 'mocha';

import {InputBinding} from '../binding/input';
import {InputBindingController} from '../controller/input-binding';
import {NumberTextInputController} from '../controller/input/number-text';
import * as NumberConverter from '../converter/number';
import {NumberFormatter} from '../formatter/number';
import {TestUtil} from '../misc/test-util';
import {InputValue} from '../model/input-value';
import {Target} from '../model/target';
import {StringNumberParser} from '../parser/string-number';
import {InputBindingApi} from './input-binding';

function createApi(target: Target) {
	const doc = TestUtil.createWindow().document;
	const value = new InputValue(0);
	const ic = new NumberTextInputController(doc, {
		formatter: new NumberFormatter(0),
		parser: StringNumberParser,
		value: value,
	});
	const bc = new InputBindingController(doc, {
		binding: new InputBinding({
			reader: NumberConverter.fromMixed,
			target: target,
			value: value,
			writer: (v) => v,
		}),
		controller: ic,
		label: 'label',
	});
	return new InputBindingApi(bc);
}

describe(InputBindingApi.name, () => {
	it('should dispose', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new Target(PARAMS, 'foo'));
		api.dispose();
		assert.strictEqual(api.controller.view.disposed, true);
	});

	it('should listen change event', (done) => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new Target(PARAMS, 'foo'));
		api.on('change', (value) => {
			assert.strictEqual(value, 123);
			done();
		});
		api.controller.controller.value.rawValue = 123;
	});

	it('should refresh bound value', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new Target(PARAMS, 'foo'));

		PARAMS.foo = 123;
		api.refresh();

		assert.strictEqual(api.controller.binding.value.rawValue, 123);
	});
});
