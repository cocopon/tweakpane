// @flow

import {describe, it} from 'mocha';
import {assert} from 'chai';

import * as NumberConverter from '../converter/number';
import ManualTicker from '../misc/ticker/manual';
import Target from '../model/target';
import MonitorValue from '../model/monitor-value';
import MonitorBinding from './monitor';

describe(MonitorBinding.name, () => {
	it('should get value', () => {
		const obj = {
			foo: 123,
		};
		const target = new Target(obj, 'foo');
		const value = new MonitorValue(1);
		const ticker = new ManualTicker();
		const b = new MonitorBinding({
			reader: NumberConverter.fromMixed,
			value: value,
			target: target,
			ticker: ticker,
		});

		assert.strictEqual(b.value, value);
	});

	it('should bind value', () => {
		const obj = {
			foo: 123,
		};
		const target = new Target(obj, 'foo');
		const value = new MonitorValue(1);
		const ticker = new ManualTicker();
		new MonitorBinding({
			reader: NumberConverter.fromMixed,
			value: value,
			target: target,
			ticker: ticker,
		});

		assert.strictEqual(
			value.rawValues[0],
			123,
			'Initial value of target should be applied',
		);

		obj.foo = 456;
		ticker.tick();

		assert.strictEqual(
			value.rawValues[0],
			456,
			'Binded value should be updated',
		);
	});

	it('should bind value', () => {
		const obj = {
			foo: 123,
		};
		const target = new Target(obj, 'foo');
		const value = new MonitorValue(1);
		const ticker = new ManualTicker();
		new MonitorBinding({
			reader: NumberConverter.fromMixed,
			value: value,
			target: target,
			ticker: ticker,
		});

		assert.strictEqual(
			value.rawValues[0],
			123,
			'Initial value of target should be applied',
		);

		delete obj.foo;
		ticker.tick();

		assert.strictEqual(
			value.rawValues[0],
			123,
			'Deleted value should be pushed',
		);
	});
});
