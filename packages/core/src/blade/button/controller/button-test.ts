import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {ButtonPropsObject} from '../view/button.js';
import {ButtonController} from './button.js';

function createController(doc: Document, title: string) {
	return new ButtonController(doc, {
		props: ValueMap.fromObject<ButtonPropsObject>({
			title: title,
		}),
		viewProps: ViewProps.create(),
	});
}

describe(ButtonController.name, () => {
	it('should emit click event', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'Push');

		let count = 0;
		c.emitter.on('click', () => {
			count += 1;
		});

		c.view.buttonElement.click();
		assert.strictEqual(count, 1);
	});

	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'foo');

		assert.deepStrictEqual(c.exportProps(), {
			title: 'foo',
		});
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'foo');

		assert.strictEqual(
			c.importProps({
				title: 'bar',
			}),
			true,
		);
		assert.strictEqual(c.props.get('title'), 'bar');
	});
});
