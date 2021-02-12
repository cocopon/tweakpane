import {assert} from 'chai';
import {describe, it} from 'mocha';

import {MonitorBinding} from '../binding/monitor';
import * as NumberConverter from '../converter/number';
import {NumberFormatter} from '../formatter/number';
import {TestUtil} from '../misc/test-util';
import {ManualTicker} from '../misc/ticker/manual';
import {MonitorValue} from '../model/monitor-value';
import {Target} from '../model/target';
import {ViewModel} from '../model/view-model';
import {MonitorBindingController} from './monitor-binding';
import {SingleLogMonitorController} from './monitor/single-log';

describe(MonitorBindingController.name, () => {
	it('should get properties', () => {
		const obj = {
			foo: 123,
		};
		const doc = TestUtil.createWindow().document;
		const value = new MonitorValue(10);
		const binding = new MonitorBinding({
			reader: NumberConverter.fromMixed,
			target: new Target(obj, 'foo'),
			ticker: new ManualTicker(),
			value: value,
		});
		const controller = new SingleLogMonitorController(doc, {
			viewModel: new ViewModel(),
			formatter: new NumberFormatter(0),
			value: value,
		});
		const bc = new MonitorBindingController(doc, {
			binding: binding,
			controller: controller,
			label: 'foo',
		});
		assert.strictEqual(bc.binding, binding);
		assert.strictEqual(bc.controller, controller);
		assert.strictEqual(bc.view.label, 'foo');
	});
});
