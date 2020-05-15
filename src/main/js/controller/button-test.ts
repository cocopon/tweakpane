import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {Disposable} from '../model/disposable';
import {ButtonController} from './button';

describe(ButtonController.name, () => {
	it('should emit click event', (done) => {
		const doc = TestUtil.createWindow().document;
		const c = new ButtonController(doc, {
			disposable: new Disposable(),
			title: 'Push',
		});

		c.button.emitter.on('click', () => {
			assert(true);
			done();
		});

		c.view.buttonElement.click();
	});
});
