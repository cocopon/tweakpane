import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadonlyBinding} from '../../../common/binding/readonly';
import {BindingTarget} from '../../../common/binding/target';
import {ManualTicker} from '../../../common/binding/ticker/manual';
import {MonitorBindingValue} from '../../../common/binding/value/monitor-binding';
import {
	createNumberFormatter,
	numberFromUnknown,
} from '../../../common/converter/number';
import {Buffer} from '../../../common/model/buffered-value';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {SingleLogController} from '../../../monitor-binding/common/controller/single-log';
import {assertInitialState, assertUpdates} from '../../common/api/test-util';
import {TpChangeEvent} from '../../common/api/tp-event';
import {createBlade} from '../../common/model/blade';
import {LabeledValueController} from '../../label/controller/value-label';
import {LabelPropsObject} from '../../label/view/label';
import {MonitorBindingController} from '../controller/monitor-binding';
import {BindingApi} from './binding';
import {MonitorBindingApi} from './monitor-binding';

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
	const bc = new LabeledValueController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: 'label',
		}),
		value: v,
		valueController: mc,
	}) as MonitorBindingController<number>;
	return new BindingApi<
		Buffer<number>,
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

		const ticker = api.controller_.value.ticker;
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

		assert.strictEqual(api.controller_.value.rawValue[0], 123);
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
