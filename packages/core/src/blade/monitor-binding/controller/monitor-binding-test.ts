import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadonlyBinding} from '../../../common/binding/readonly';
import {BindingTarget} from '../../../common/binding/target';
import {ManualTicker} from '../../../common/binding/ticker/manual';
import {MonitorBindingValue} from '../../../common/binding/value/monitor';
import {createNumberFormatter} from '../../../common/converter/number';
import {numberFromUnknown} from '../../../common/converter/number';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {SingleLogController} from '../../../monitor-binding/common/controller/single-log';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../../label/view/label';
import {MonitorBindingController} from './monitor-binding';

function create(): MonitorBindingController<number> {
	const obj = {
		foo: 123,
	};
	const doc = createTestWindow().document;
	const value = new MonitorBindingValue<number>({
		binding: new ReadonlyBinding({
			reader: numberFromUnknown,
			target: new BindingTarget(obj, 'foo'),
		}),
		bufferSize: 10,
		ticker: new ManualTicker(),
	});
	const controller = new SingleLogController(doc, {
		formatter: createNumberFormatter(0),
		value: value,
		viewProps: ViewProps.create(),
	});
	return new MonitorBindingController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: 'foo',
		}),
		value: value,
		valueController: controller,
	});
}

describe(MonitorBindingController.name, () => {
	it('should disable ticker', () => {
		const bc = create();
		assert.strictEqual(bc.value.ticker.disabled, false);
		bc.viewProps.set('disabled', true);
		assert.strictEqual(bc.value.ticker.disabled, true);
	});
});
