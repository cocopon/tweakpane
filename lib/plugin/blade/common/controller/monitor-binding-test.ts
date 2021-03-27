import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {MonitorBinding} from '../../../common/binding/monitor';
import {BindingTarget} from '../../../common/binding/target';
import {ManualTicker} from '../../../common/binding/ticker/manual';
import {createNumberFormatter} from '../../../common/converter/number';
import {numberFromUnknown} from '../../../common/converter/number';
import {Value} from '../../../common/model/value';
import {createViewProps} from '../../../common/model/view-props';
import {SingleLogMonitorController} from '../../../monitor-bindings/common/controller/single-log';
import {Blade} from '../model/blade';
import {MonitorBindingController} from './monitor-binding';

function create(): MonitorBindingController<number> {
	const obj = {
		foo: 123,
	};
	const doc = TestUtil.createWindow().document;
	const value = new Value(Array(10).fill(undefined));
	const binding = new MonitorBinding({
		reader: numberFromUnknown,
		target: new BindingTarget(obj, 'foo'),
		ticker: new ManualTicker(),
		value: value,
	});
	const controller = new SingleLogMonitorController(doc, {
		formatter: createNumberFormatter(0),
		value: value,
		viewProps: createViewProps(),
	});
	return new MonitorBindingController(doc, {
		binding: binding,
		controller: controller,
		label: 'foo',
		blade: new Blade(),
	});
}

describe(MonitorBindingController.name, () => {
	it('should get properties', () => {
		const bc = create();
		assert.strictEqual(bc.view.label, 'foo');
	});

	it('should disable ticker', () => {
		const bc = create();
		assert.isFalse(bc.binding.ticker.disabled);
		bc.viewProps.set('disabled', true);
		assert.isTrue(bc.binding.ticker.disabled);
	});
});
