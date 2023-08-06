import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingController} from '../../../blade/binding/controller/binding.js';
import {createBlade} from '../../../blade/common/model/blade.js';
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
import {GraphLogController} from '../controller/graph-log.js';
import {GraphLogMonitorBindingApi} from './graph-log.js';

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
	const c = new BindingController<
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
