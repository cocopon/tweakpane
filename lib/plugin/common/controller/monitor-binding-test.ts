import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {SingleLogMonitorController} from '../../monitor-bindings/common/controller/single-log';
import {MonitorBinding} from '../binding/monitor';
import {ManualTicker} from '../binding/ticker/manual';
import {Target} from '../model/target';
import {Value} from '../model/value';
import {ViewModel} from '../model/view-model';
import {numberFromUnknown} from '../reader/number';
import {NumberFormatter} from '../writer/number';
import {MonitorBindingController} from './monitor-binding';

describe(MonitorBindingController.name, () => {
	it('should get properties', () => {
		const obj = {
			foo: 123,
		};
		const doc = TestUtil.createWindow().document;
		const value = new Value(Array(10).fill(undefined));
		const binding = new MonitorBinding({
			reader: numberFromUnknown,
			target: new Target(obj, 'foo'),
			ticker: new ManualTicker(),
			value: value,
		});
		const controller = new SingleLogMonitorController(doc, {
			formatter: new NumberFormatter(0),
			value: value,
		});
		const bc = new MonitorBindingController(doc, {
			binding: binding,
			controller: controller,
			label: 'foo',
			viewModel: new ViewModel(),
		});
		assert.strictEqual(bc.binding, binding);
		assert.strictEqual(bc.controller, controller);
		assert.strictEqual(bc.view.label, 'foo');
	});
});
