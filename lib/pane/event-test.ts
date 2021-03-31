import {describe, it} from 'mocha';

import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
		title: 'Title',
	});
}

describe(Tweakpane.name, () => {
	it('should listen fold event', (done) => {
		const pane = createPane();
		pane.on('fold', () => {
			done();
		});

		const folder = pane.controller_.folder;
		if (folder) {
			folder.expanded = false;
		}
	});
});
