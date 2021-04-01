import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {ButtonController} from './button';

describe(ButtonController.name, () => {
	it('should emit click event', () => {
		const doc = TestUtil.createWindow().document;
		const c = new ButtonController(doc, {
			props: new ValueMap({
				title: 'Push',
			}),
			viewProps: createViewProps(),
		});

		let count = 0;
		c.emitter.on('click', () => {
			count += 1;
		});

		c.view.buttonElement.click();
		assert.strictEqual(count, 1);
	});
});
