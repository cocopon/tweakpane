import {assert} from 'chai';
import {describe, it} from 'mocha';

import {MonitorBinding} from '../binding/monitor';
import {MonitorBindingController} from '../controller/monitor-binding';
import {SingleLogMonitorController} from '../controller/monitor/single-log';
import * as NumberConverter from '../converter/number';
import {NumberFormatter} from '../formatter/number';
import {TestUtil} from '../misc/test-util';
import {ManualTicker} from '../misc/ticker/manual';
import {Target} from '../model/target';
import {Value} from '../model/value';
import {ViewModel} from '../model/view-model';
import {MonitorBindingApi} from './monitor-binding';

function createApi(target: Target) {
	const doc = TestUtil.createWindow().document;
	const value = new Value([0]);
	const mc = new SingleLogMonitorController(doc, {
		viewModel: new ViewModel(),
		formatter: new NumberFormatter(0),
		value: value,
	});
	const bc = new MonitorBindingController(doc, {
		binding: new MonitorBinding({
			reader: NumberConverter.fromMixed,
			target: target,
			ticker: new ManualTicker(),
			value: value,
		}),
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
		const api = createApi(new Target(PARAMS, 'foo'));
		api.on('update', (value: unknown) => {
			assert.strictEqual(value, 123);
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
		const api = createApi(new Target(PARAMS, 'foo'));

		PARAMS.foo = 123;
		api.refresh();

		assert.strictEqual(api.controller.binding.value.rawValue[0], 123);
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
