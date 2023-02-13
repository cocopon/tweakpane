import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createBlade} from '../../../blade/common/model/blade';
import {LabeledValueController} from '../../../blade/label/controller/value-label';
import {LabelPropsObject} from '../../../blade/label/view/label';
import {ReadonlyBinding} from '../../../common/binding/readonly';
import {BindingTarget} from '../../../common/binding/target';
import {ManualTicker} from '../../../common/binding/ticker/manual';
import {MonitorBindingValue} from '../../../common/binding/value/monitor-binding';
import {
	createNumberFormatter,
	numberFromUnknown,
} from '../../../common/converter/number';
import {TpBuffer} from '../../../common/model/buffered-value';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {GraphLogController} from '../controller/graph-log';
import {GraphLogMonitorBindingApi} from './graph-log';

function createApi(config: {
	min: number;
	max: number;
}): GraphLogMonitorBindingApi {
	const doc = createTestWindow().document;
	const v = new MonitorBindingValue({
		binding: new ReadonlyBinding({
			reader: numberFromUnknown,
			target: new BindingTarget({foo: 0}, 'foo'),
		}),
		bufferSize: 10,
		ticker: new ManualTicker(),
	});
	const c = new LabeledValueController<
		TpBuffer<number>,
		GraphLogController,
		MonitorBindingValue<number>
	>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: '',
		}),
		value: v,
		valueController: new GraphLogController(doc, {
			formatter: createNumberFormatter(1),
			rows: 1,
			props: ValueMap.fromObject({
				max: config.max,
				min: config.min,
			}),
			value: v,
			viewProps: ViewProps.create(),
		}),
	});
	return new GraphLogMonitorBindingApi(c);
}

describe(GraphLogMonitorBindingApi.name, () => {
	it('should get min/max', () => {
		const api = createApi({min: -100, max: 100});
		assert.strictEqual(api.min, -100);
		assert.strictEqual(api.max, 100);
		api.dispose();
	});

	it('should set min/max', () => {
		const api = createApi({min: -100, max: 100});
		api.min = -123;
		api.max = 456;
		assert.strictEqual(api.min, -123);
		assert.strictEqual(api.max, 456);
		api.dispose();
	});
});
