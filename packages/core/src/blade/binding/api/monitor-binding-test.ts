import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadonlyBinding} from '../../../common/binding/readonly.js';
import {BindingTarget} from '../../../common/binding/target.js';
import {ManualTicker} from '../../../common/binding/ticker/manual.js';
import {MonitorBindingValue} from '../../../common/binding/value/monitor-binding.js';
import {
	createNumberFormatter,
	numberFromUnknown,
} from '../../../common/converter/number.js';
import {LabelPropsObject} from '../../../common/label/view/label.js';
import {TpBuffer} from '../../../common/model/buffered-value.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {SingleLogController} from '../../../monitor-binding/common/controller/single-log.js';
import {assertInitialState, assertUpdates} from '../../common/api/test-util.js';
import {TpChangeEvent} from '../../common/api/tp-event.js';
import {createBlade} from '../../common/model/blade.js';
import {MonitorBindingController} from '../controller/monitor-binding.js';
import {BindingApi} from './binding.js';
import {MonitorBindingApi} from './monitor-binding.js';

function createApi(target: BindingTarget): MonitorBindingApi<number> {
	const doc = createTestWindow().document;
	const v = new MonitorBindingValue({
		binding: new ReadonlyBinding({
			reader: numberFromUnknown,
			target: target,
		}),
		bufferSize: 1,
		ticker: new ManualTicker(),
	});
	const mc = new SingleLogController(doc, {
		formatter: createNumberFormatter(0),
		value: v,
		viewProps: ViewProps.create(),
	});
	const bc = new MonitorBindingController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: 'label',
		}),
		value: v,
		valueController: mc,
	});
	return new BindingApi<
		TpBuffer<number>,
		number,
		MonitorBindingController<number>
	>(bc);
}

describe('MonitorBindingApi', () => {
	it('should have initial state', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		assertInitialState(api);
		assert.strictEqual(api.label, 'label');
	});

	it('should update properties', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		assertUpdates(api);

		api.label = 'changed';
		assert.strictEqual(api.label, 'changed');
	});

	it('should listen change event', (done) => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		api.on('change', (ev) => {
			assert.strictEqual(ev instanceof TpChangeEvent, true);
			assert.strictEqual(ev.value, 123);
			done();
		});

		PARAMS.foo = 123;

		const ticker = api.controller.value.ticker;
		if (ticker instanceof ManualTicker) {
			ticker.tick();
		}
	});

	it('should refresh bound value', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));

		PARAMS.foo = 123;
		api.refresh();

		assert.strictEqual(api.controller.value.rawValue[0], 123);
	});

	it('should hide', () => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		assert.strictEqual(api.hidden, false);

		api.hidden = true;
		assert.strictEqual(
			api.controller.view.element.classList.contains('tp-v-hidden'),
			true,
		);
	});
});
