import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {InputBinding} from '../plugin/common/binding/input';
import {InputBindingController} from '../plugin/common/controller/input-binding';
import {Target} from '../plugin/common/model/target';
import {Value} from '../plugin/common/model/value';
import {ViewModel} from '../plugin/common/model/view-model';
import {numberFromUnknown} from '../plugin/common/reader/number';
import {StringNumberParser} from '../plugin/common/reader/string-number';
import {NumberFormatter} from '../plugin/common/writer/number';
import {NumberTextController} from '../plugin/input-bindings/number/controller/number-text';
import {InputBindingApi} from './input-binding';

function createApi(target: Target) {
	const doc = TestUtil.createWindow().document;
	const value = new Value(0);
	const ic = new NumberTextController(doc, {
		baseStep: 1,
		formatter: new NumberFormatter(0),
		parser: StringNumberParser,
		value: value,
	});
	const bc = new InputBindingController(doc, {
		binding: new InputBinding({
			reader: numberFromUnknown,
			target: target,
			value: value,
			writer: (v) => v,
		}),
		controller: ic,
		label: 'label',
		viewModel: new ViewModel(),
	});
	return new InputBindingApi(bc);
}

describe(InputBindingApi.name, () => {
	it('should listen change event', (done) => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new Target(PARAMS, 'foo'));
		api.on('change', (value: unknown) => {
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

	it('should hide', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new Target(PARAMS, 'foo'));
		assert.strictEqual(api.hidden, false);

		api.hidden = true;
		assert.isTrue(
			api.controller.view.element.classList.contains('tp-v-hidden'),
		);
	});
});
