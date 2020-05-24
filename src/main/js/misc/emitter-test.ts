import {assert} from 'chai';
import {describe, it} from 'mocha';

import {Emitter} from './emitter';

describe(Emitter.name, () => {
	it('should emit event', (done) => {
		const e = new Emitter();

		e.on('change', () => {
			done();
		});

		e.emit('change', {});
	});

	it('should emit event with arguments', (done) => {
		const e = new Emitter();

		e.on('change', ({arg1, arg2}: {arg1: string; arg2: number}) => {
			assert.strictEqual(arg1, 'foo');
			assert.strictEqual(arg2, 0.53);
			done();
		});

		e.emit('change', {arg1: 'foo', arg2: 0.53});
	});

	it('should remove listener', () => {
		const e = new Emitter();

		const handler = () => {
			throw new Error('should not be called');
		};

		e.on('change', handler);
		e.off('change', handler);

		e.emit('change', {});
	});
});
