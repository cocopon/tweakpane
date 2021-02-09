import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {PlainTweakpane} from '../plain-tweakpane';

function createPane(): PlainTweakpane {
	return new PlainTweakpane({
		document: TestUtil.createWindow().document,
		title: 'Title',
	});
}

describe(PlainTweakpane.name, () => {
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
