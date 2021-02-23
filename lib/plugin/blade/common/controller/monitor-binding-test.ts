import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {MonitorBinding} from '../../../common/binding/monitor';
import {BindingTarget} from '../../../common/binding/target';
import {ManualTicker} from '../../../common/binding/ticker/manual';
import {NumberFormatter} from '../../../common/converter/number';
import {numberFromUnknown} from '../../../common/converter/number';
import {Value} from '../../../common/model/value';
import {SingleLogMonitorController} from '../../../monitor-bindings/common/controller/single-log';
import {Blade} from '../model/blade';
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
			target: new BindingTarget(obj, 'foo'),
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
			blade: new Blade(),
		});
		assert.strictEqual(bc.binding, binding);
		assert.strictEqual(bc.controller, controller);
		assert.strictEqual(bc.view.label, 'foo');
	});
});
