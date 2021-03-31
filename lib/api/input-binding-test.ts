import * as assert from 'assert';
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
import {BoundValue} from '../plugin/common/model/bound-value';
import {createViewProps} from '../plugin/common/model/view-props';
import {writePrimitive} from '../plugin/common/primitive';
import {NumberTextController} from '../plugin/input-bindings/number/controller/number-text';
import {InputBindingApi} from './input-binding';
import {TpChangeEvent} from './tp-event';

function createApi(target: BindingTarget) {
	const doc = TestUtil.createWindow().document;
	const value = new BoundValue(0);
	const ic = new NumberTextController(doc, {
		baseStep: 1,
		draggingScale: 1,
		formatter: createNumberFormatter(0),
		parser: parseNumber,
		value: value,
		viewProps: createViewProps(),
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
			assert.strictEqual(ev instanceof TpChangeEvent, true);
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.presetKey, 'foo');
			assert.strictEqual(ev.value, 123);
			done();
		});
		api.controller_.controller.value.rawValue = 123;
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
		api.controller_.controller.value.rawValue = 123;
	});

	it('should refresh bound value', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));

		PARAMS.foo = 123;
		api.refresh();

		assert.strictEqual(api.controller_.binding.value.rawValue, 123);
	});

	it('should be hidden', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		assert.strictEqual(api.hidden, false);

		api.hidden = true;
		assert.strictEqual(
			api.controller_.view.element.classList.contains('tp-v-hidden'),
			true,
		);
	});

	it('should be disabled', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		assert.strictEqual(api.disabled, false);

		api.disabled = true;
		assert.strictEqual(
			api.controller_.view.element.classList.contains('tp-v-disabled'),
			true,
		);
	});
});
