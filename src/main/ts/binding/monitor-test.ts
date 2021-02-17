import {assert} from 'chai';
import {describe, it} from 'mocha';

import * as NumberConverter from '../converter/number';
import {ManualTicker} from '../misc/ticker/manual';
import {Target} from '../model/target';
import {Value} from '../model/value';
import {MonitorBinding} from './monitor';

describe(MonitorBinding.name, () => {
	it('should get value', () => {
		const obj = {
			foo: 123,
		};
		const target = new Target(obj, 'foo');
		const value = new Value({
			bufferSize: 1,
			values: [],
		});
		const ticker = new ManualTicker();
		const b = new MonitorBinding({
			reader: NumberConverter.fromMixed,
			target: target,
			ticker: ticker,
			value: value,
		});

		assert.strictEqual(b.value, value);
	});

	it('should bind value', () => {
		const obj = {
			foo: 123,
		};
		const target = new Target(obj, 'foo');
		const value = new Value({
			bufferSize: 1,
			values: [],
		});
		const ticker = new ManualTicker();
		// tslint:disable-next-line:no-unused-expression
		new MonitorBinding({
			reader: NumberConverter.fromMixed,
			target: target,
			ticker: ticker,
			value: value,
		});

		assert.strictEqual(
			value.rawValue.values[0],
			123,
			'Initial value of target should be applied',
		);

		obj.foo = 456;
		ticker.tick();

		assert.strictEqual(
			value.rawValue.values[0],
			456,
			'Binded value should be updated',
		);
	});

	it('should bind value', () => {
		const obj: {
			foo?: number;
		} = {
			foo: 123,
		};
		const target = new Target(obj, 'foo');
		const value = new Value({
			bufferSize: 1,
			values: [],
		});
		const ticker = new ManualTicker();
		// tslint:disable-next-line:no-unused-expression
		new MonitorBinding({
			reader: NumberConverter.fromMixed,
			target: target,
			ticker: ticker,
			value: value,
		});

		assert.strictEqual(
			value.rawValue.values[0],
			123,
			'Initial value of target should be applied',
		);

		delete obj.foo;
		ticker.tick();

		assert.strictEqual(
			value.rawValue.values[0],
			123,
			'Deleted value should be pushed',
		);
	});
});
