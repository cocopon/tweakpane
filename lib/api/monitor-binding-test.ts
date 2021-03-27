import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {MonitorBindingController} from '../plugin/blade/common/controller/monitor-binding';
import {Blade} from '../plugin/blade/common/model/blade';
import {MonitorBinding} from '../plugin/common/binding/monitor';
import {BindingTarget} from '../plugin/common/binding/target';
import {ManualTicker} from '../plugin/common/binding/ticker/manual';
import {createNumberFormatter} from '../plugin/common/converter/number';
import {numberFromUnknown} from '../plugin/common/converter/number';
import {Buffer} from '../plugin/common/model/buffered-value';
import {Value} from '../plugin/common/model/value';
import {createViewProps} from '../plugin/common/model/view-props';
import {SingleLogMonitorController} from '../plugin/monitor-bindings/common/controller/single-log';
import {MonitorBindingApi} from './monitor-binding';
import {TpUpdateEvent} from './tp-event';

function createApi(target: BindingTarget) {
	const doc = TestUtil.createWindow().document;
	const value = new Value([0] as Buffer<number>);
	const mc = new SingleLogMonitorController(doc, {
		formatter: createNumberFormatter(0),
		value: value,
		viewProps: createViewProps(),
	});
	const bc = new MonitorBindingController(doc, {
		binding: new MonitorBinding({
			reader: numberFromUnknown,
			target: target,
			ticker: new ManualTicker(),
			value: value,
		}),
		blade: new Blade(),
		controller: mc,
		label: 'label',
	});
	return new MonitorBindingApi(bc);
}

describe(MonitorBindingApi.name, () => {
	it('should listen update event', (done) => {
		const PARAMS = {
			foo: 0,
		};
		const api = createApi(new BindingTarget(PARAMS, 'foo'));
		api.on('update', (ev) => {
			assert.instanceOf(ev, TpUpdateEvent);
			assert.strictEqual(ev.value, 123);
			done();
		});

		PARAMS.foo = 123;

		const ticker = api.controller.binding.ticker;
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

		assert.strictEqual(api.controller.binding.value.rawValue[0], 123);
	});

	it('should hide', () => {
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
});
