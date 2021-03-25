import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {defaultViewProps} from '../../../common/view/view';
import {ButtonController} from './button';

describe(ButtonController.name, () => {
	it('should emit click event', (done) => {
		const doc = TestUtil.createWindow().document;
		const c = new ButtonController(doc, {
			title: 'Push',
			viewProps: defaultViewProps(),
		});

		c.button.emitter.on('click', () => {
			assert(true);
			done();
		});

		c.view.buttonElement.click();
	});
});
