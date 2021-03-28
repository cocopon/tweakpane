import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {createViewProps} from '../../../common/model/view-props';
import {ButtonController} from './button';

describe(ButtonController.name, () => {
	it('should emit click event', () => {
		const doc = TestUtil.createWindow().document;
		const c = new ButtonController(doc, {
			title: 'Push',
			viewProps: createViewProps(),
		});

		let count = 0;
		c.button.emitter.on('click', () => {
			count += 1;
		});

		c.view.buttonElement.click();
		assert.strictEqual(count, 1);
	});
});
