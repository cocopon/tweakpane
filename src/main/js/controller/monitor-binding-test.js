// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import * as NumberConverter from '../converter/number';
import MonitorBinding from '../binding/monitor';
import NumberFormatter from '../formatter/number';
import ManualTicker from '../misc/ticker/manual';
import TestUtil from '../misc/test-util';
import MonitorValue from '../model/monitor-value';
import Target from '../model/target';
import NumberParser from '../parser/number';
import SingleLogMonitorController from './monitor/single-log';
import MonitorBindingController from './monitor-binding';

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
			formatter: new NumberFormatter(0),
			parser: NumberParser,
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
