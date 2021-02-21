import {assert} from 'chai';
import {describe, it} from 'mocha';

import {ViewModel} from './view-model';

describe(ViewModel.name, () => {
	it('should be shown by default', () => {
		const vm = new ViewModel();
		assert.strictEqual(vm.hidden, false);
	});

	it('should emit change event for hidden', (done) => {
		const vm = new ViewModel();
		vm.emitter.on('change', (ev) => {
			assert.strictEqual(ev.propertyName, 'hidden');
			assert.strictEqual(vm.hidden, true);
			done();
		});
		vm.hidden = true;
	});

	it('should not emit change event by setting hidden to same value', () => {
		const vm = new ViewModel();
		vm.emitter.on('change', () => {
			throw new Error('should not be called');
		});
		vm.hidden = false;
	});
});
