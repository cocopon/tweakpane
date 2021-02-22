import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {Blade} from '../../common/model/blade';
import {ButtonController} from './controller';

describe(ButtonController.name, () => {
	it('should emit click event', (done) => {
		const doc = TestUtil.createWindow().document;
		const c = new ButtonController(doc, {
			blade: new Blade(),
			title: 'Push',
		});

		c.button.emitter.on('click', () => {
			assert(true);
			done();
		});

		c.view.buttonElement.click();
	});
});
