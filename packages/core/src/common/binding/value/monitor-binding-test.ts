import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadonlyBinding} from '../readonly.js';
import {BindingTarget} from '../target.js';
import {ManualTicker} from '../ticker/manual.js';
import {MonitorBindingValue} from './monitor-binding.js';

describe(MonitorBindingValue.name, () => {
	it('should set up initial value', () => {
		const v = new MonitorBindingValue({
			binding: new ReadonlyBinding({
				reader: (v) => Number(v),
				target: new BindingTarget({foo: 0}, 'foo'),
			}),
			bufferSize: 3,
			ticker: new ManualTicker(),
		});
		assert.deepStrictEqual(v.rawValue, [0, undefined, undefined]);
	});

	it('should fetch value manually', () => {
		const obj = {foo: 0};
		const v = new MonitorBindingValue({
			binding: new ReadonlyBinding({
				reader: (v) => Number(v),
				target: new BindingTarget(obj, 'foo'),
			}),
			bufferSize: 3,
			ticker: new ManualTicker(),
		});

		obj.foo = 1;
		v.fetch();
		obj.foo = 2;
		v.fetch();

		assert.deepStrictEqual(v.rawValue, [0, 1, 2]);
	});

	it('should fetch value via ticker', () => {
		const obj = {foo: 0};
		const t = new ManualTicker();
		const v = new MonitorBindingValue({
			binding: new ReadonlyBinding({
				reader: (v) => Number(v),
				target: new BindingTarget(obj, 'foo'),
			}),
			bufferSize: 2,
			ticker: t,
		});

		obj.foo = 2;
		t.tick();
		obj.foo = 4;
		t.tick();

		assert.deepStrictEqual(v.rawValue, [2, 4]);
	});

	it('should emit beforechange event', (done) => {
		const obj = {foo: 0};
		const t = new ManualTicker();
		const v = new MonitorBindingValue({
			binding: new ReadonlyBinding({
				reader: (v) => Number(v),
				target: new BindingTarget(obj, 'foo'),
			}),
			bufferSize: 2,
			ticker: t,
		});

		v.emitter.on('beforechange', (ev) => {
			assert.strictEqual(ev.sender, v);
			done();
		});

		obj.foo = 1;
		t.tick();
	});

	it('should emit change event', (done) => {
		const obj = {foo: 0};
		const t = new ManualTicker();
		const v = new MonitorBindingValue({
			binding: new ReadonlyBinding({
				reader: (v) => Number(v),
				target: new BindingTarget(obj, 'foo'),
			}),
			bufferSize: 2,
			ticker: t,
		});

		v.emitter.on('change', (ev) => {
			assert.strictEqual(ev.sender, v);
			assert.deepStrictEqual(ev.previousRawValue, [0, undefined]);
			assert.deepStrictEqual(ev.rawValue, [0, 1]);
			done();
		});

		obj.foo = 1;
		v.fetch();
	});
});
