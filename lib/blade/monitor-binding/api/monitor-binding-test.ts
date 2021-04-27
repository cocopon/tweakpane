import * as assert from 'assert';
import {describe, it} from 'mocha';

import {MonitorBinding} from '../../../common/binding/monitor';
import {BindingTarget} from '../../../common/binding/target';
import {ManualTicker} from '../../../common/binding/ticker/manual';
import {
	createNumberFormatter,
	numberFromUnknown,
} from '../../../common/converter/number';
import {Buffer} from '../../../common/model/buffered-value';
import {PrimitiveValue} from '../../../common/model/primitive-value';
import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {SingleLogMonitorController} from '../../../monitor-binding/common/controller/single-log';
import {TpUpdateEvent} from '../../common/api/tp-event';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../../label/view/label';
import {MonitorBindingController} from '../controller/monitor-binding';
import {MonitorBindingApi} from './monitor-binding';

function createApi(target: BindingTarget) {
	const doc = TestUtil.createWindow().document;
	const value = new PrimitiveValue<Buffer<number>>([0]);
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
		blade: createBlade(),
		props: ValueMap.fromObject({
			label: 'label',
		} as LabelPropsObject),
		valueController: mc,
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
			assert.strictEqual(ev instanceof TpUpdateEvent, true);
			assert.strictEqual(ev.value, 123);
			done();
		});

		PARAMS.foo = 123;

		const ticker = api.controller_.binding.ticker;
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

		assert.strictEqual(api.controller_.binding.value.rawValue[0], 123);
	});

	it('should hide', () => {
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
});
