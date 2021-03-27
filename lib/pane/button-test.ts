import {assert} from 'chai';
import {describe, it} from 'mocha';

import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';

function createApi(title?: string): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
		title: title,
	});
}

describe(Tweakpane.name, () => {
	it('should add button', () => {
		const pane = createApi();
		const b = pane.addButton({
			title: 'push',
		});
		assert.strictEqual(b.controller.valueController.button.title, 'push');
	});

	it('should add disabled button', () => {
		const pane = createApi();
		const b = pane.addButton({
			disabled: true,
			title: 'push',
		});
		assert.isTrue(b.controller.viewProps.get('disabled'));
	});

	it('should add button with label', () => {
		const pane = createApi();
		const b = pane.addButton({
			label: 'foobarlabel',
			title: 'push',
		});
		assert.strictEqual(b.controller.valueController.button.title, 'push');
		assert.isTrue(
			b.controller.view.element.innerHTML.indexOf('foobarlabel') >= 0,
		);
	});
});
