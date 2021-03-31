import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBinding} from '../../../common/binding/input';
import {BindingTarget} from '../../../common/binding/target';
import {
	createNumberFormatter,
	numberFromUnknown,
	parseNumber,
} from '../../../common/converter/number';
import {BoundValue} from '../../../common/model/bound-value';
import {createViewProps} from '../../../common/model/view-props';
import {writePrimitive} from '../../../common/primitive';
import {NumberTextController} from '../../../input-binding/number/controller/number-text';
import {TestUtil} from '../../../misc/test-util';
import {InputBindingController} from '../controller/input-binding';
import {Blade} from '../model/blade';
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
