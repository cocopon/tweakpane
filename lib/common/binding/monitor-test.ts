import * as assert from 'assert';
import {describe, it} from 'mocha';

import {numberFromUnknown} from '../converter/number';
import {BoundValue} from '../model/bound-value';
import {Buffer} from '../model/buffered-value';
import {MonitorBinding} from './monitor';
import {BindingTarget} from './target';
import {ManualTicker} from './ticker/manual';

describe(MonitorBinding.name, () => {
	it('should get value', () => {
		const obj = {
			foo: 123,
		};
		const target = new BindingTarget(obj, 'foo');
		const value = new BoundValue([0] as Buffer<number>);
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
		const target = new BindingTarget(obj, 'foo');
		const value = new BoundValue([0] as Buffer<number>);
		const ticker = new ManualTicker();
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
		const target = new BindingTarget(obj, 'foo');
		const value = new BoundValue([0] as Buffer<number>);
		const ticker = new ManualTicker();
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
