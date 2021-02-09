import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {TweakpaneWithoutStyle} from '../tweakpane-without-style';

describe(TweakpaneWithoutStyle.name, () => {
	it('should toggle expanded when clicking title element', () => {
		const c = new TweakpaneWithoutStyle({
			document: TestUtil.createWindow().document,
			title: 'Tweakpane',
		});

		if (c.controller.view.titleElement) {
			c.controller.view.titleElement.click();
		}

		assert.strictEqual(
			c.controller.folder && c.controller.folder.expanded,
			false,
		);
	});
});
