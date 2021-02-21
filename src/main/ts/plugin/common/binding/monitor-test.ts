import {assert} from 'chai';
import {describe, it} from 'mocha';

import {Buffer} from '../model/buffered-value';
import {Target} from '../model/target';
import {Value} from '../model/value';
import {numberFromUnknown} from '../parser/number';
import {MonitorBinding} from './monitor';
import {ManualTicker} from './ticker/manual';

describe(MonitorBinding.name, () => {
	it('should get value', () => {
		const obj = {
			foo: 123,
		};
		const target = new Target(obj, 'foo');
		const value = new Value([0] as Buffer<number>);
		const ticker = new ManualTicker();
		const b = new MonitorBinding({
			reader: numberFromUnknown,
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
		const value = new Value([0] as Buffer<number>);
		const ticker = new ManualTicker();
		// tslint:disable-next-line:no-unused-expression
		new MonitorBinding({
			reader: numberFromUnknown,
			target: target,
			ticker: ticker,
			value: value,
		});

		assert.strictEqual(
			value.rawValue[0],
			123,
			'Initial value of target should be applied',
		);

		obj.foo = 456;
		ticker.tick();

		assert.strictEqual(
			value.rawValue[0],
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
		const value = new Value([0] as Buffer<number>);
		const ticker = new ManualTicker();
		// tslint:disable-next-line:no-unused-expression
		new MonitorBinding({
			reader: numberFromUnknown,
			target: target,
			ticker: ticker,
			value: value,
		});

		assert.strictEqual(
			value.rawValue[0],
			123,
			'Initial value of target should be applied',
		);

		delete obj.foo;
		ticker.tick();

		assert.strictEqual(
			value.rawValue[0],
			123,
			'Deleted value should not be pushed',
		);
	});
});
