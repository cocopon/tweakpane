import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {TweakpaneWithoutStyle} from '../tweakpane-without-style';

function createPane(): TweakpaneWithoutStyle {
	return new TweakpaneWithoutStyle({
		document: TestUtil.createWindow().document,
		title: 'Title',
	});
}

describe(TweakpaneWithoutStyle.name, () => {
	it('should listen fold event', (done) => {
		const api = createPane();
		api.on('fold', () => {
			done();
		});

		const folder = api.controller.folder;
		if (folder) {
			folder.expanded = false;
		}
	});
});
