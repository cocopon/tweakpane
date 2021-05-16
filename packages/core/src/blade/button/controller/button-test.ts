import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {ButtonPropsObject} from '../view/button';
import {ButtonController} from './button';

describe(ButtonController.name, () => {
	it('should emit click event', () => {
		const doc = createTestWindow().document;
		const c = new ButtonController(doc, {
			props: ValueMap.fromObject<ButtonPropsObject>({
				title: 'Push',
			}),
			viewProps: ViewProps.create(),
		});

		let count = 0;
		c.emitter.on('click', () => {
			count += 1;
		});

		c.view.buttonElement.click();
		assert.strictEqual(count, 1);
	});
});
