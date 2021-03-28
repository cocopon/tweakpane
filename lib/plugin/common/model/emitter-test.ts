import * as assert from 'assert';
import {describe, it} from 'mocha';

import {Emitter} from './emitter';

describe(Emitter.name, () => {
	it('should emit event', (done) => {
		const e = new Emitter<{
			change: {
				sender: unknown;
			};
		}>();

		e.on('change', () => {
			done();
		});

		e.emit('change', {sender: e});
	});

	it('should emit event with arguments', (done) => {
		const e = new Emitter<{
			change: {
				arg1: string;
				arg2: number;
				sender: unknown;
			};
		}>();

		e.on('change', (ev: {arg1: string; arg2: number; sender: unknown}) => {
			assert.strictEqual(ev.arg1, 'foo');
			assert.strictEqual(ev.arg2, 0.53);
			done();
		});

		e.emit('change', {
			arg1: 'foo',
			arg2: 0.53,
			sender: e,
		});
	});

	it('should remove listener', () => {
		const e = new Emitter<{
			change: {
				sender: unknown;
			};
		}>();

		const handler = () => {
			assert.fail('should not be called');
		};

		e.on('change', handler);
		e.off('change', handler);

		e.emit('change', {sender: e});
	});
});
