import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {InputBindingController} from '../plugin/blade/common/controller/input-binding';
import {Blade} from '../plugin/blade/common/model/blade';
import {InputBinding} from '../plugin/common/binding/input';
import {BindingTarget} from '../plugin/common/binding/target';
import {
	createNumberFormatter,
	parseNumber,
} from '../plugin/common/converter/number';
import {numberFromUnknown} from '../plugin/common/converter/number';
import {Value} from '../plugin/common/model/value';
import {writePrimitive} from '../plugin/common/primitive';
import {defaultViewProps} from '../plugin/common/view/view';
import {NumberTextController} from '../plugin/input-bindings/number/controller/number-text';
import {InputBindingApi} from './input-binding';
import {TpChangeEvent} from './tp-event';

function createApi(target: BindingTarget) {
	const doc = TestUtil.createWindow().document;
	const value = new Value(0);
	const ic = new NumberTextController(doc, {
		baseStep: 1,
		draggingScale: 1,
		formatter: createNumberFormatter(0),
		parser: parseNumber,
		value: value,
		viewProps: defaultViewProps(),
	});
	const bc = new InputBindingController(doc, {
		binding: new InputBinding({
			reader: numberFromUnknown,
			target: target,
			value: value,
			writer: writePrimitive,
		}),
		blade: new Blade(),
		controller: ic,
		label: 'label',
	});
	return new InputBindingApi(bc);
}

describe(InputBindingApi.name, () => {
	it('should listen change event', (done) => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		api.on('change', (ev) => {
			assert.instanceOf(ev, TpChangeEvent);
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.presetKey, 'foo');
			assert.strictEqual(ev.value, 123);
			done();
		});
		api.controller.controller.value.rawValue = 123;
	});

	it('should apply presetKey to event object', (done) => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo', 'renamed'));
		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, 'renamed');
			done();
		});
		api.controller.controller.value.rawValue = 123;
	});

	it('should refresh bound value', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));

		PARAMS.foo = 123;
		api.refresh();

		assert.strictEqual(api.controller.binding.value.rawValue, 123);
	});

	it('should be hidden', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		assert.strictEqual(api.hidden, false);

		api.hidden = true;
		assert.isTrue(
			api.controller.view.element.classList.contains('tp-v-hidden'),
		);
	});

	it('should be disabled', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		assert.strictEqual(api.disabled, false);

		api.disabled = true;
		assert.isTrue(
			api.controller.view.element.classList.contains('tp-v-disabled'),
		);
	});
});
