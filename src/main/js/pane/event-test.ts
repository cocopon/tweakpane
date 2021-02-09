import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {PlainTweakpane} from './plain-tweakpane';

function createPane(): PlainTweakpane {
	return new PlainTweakpane({
		document: TestUtil.createWindow().document,
		title: 'Title',
	});
}

describe(PlainTweakpane.name, () => {
	it('should listen fold event', (done) => {
		const pane = createPane();
		pane.on('fold', () => {
			done();
		});

		const folder = pane.controller.folder;
		if (folder) {
			folder.expanded = false;
		}
	});
});
