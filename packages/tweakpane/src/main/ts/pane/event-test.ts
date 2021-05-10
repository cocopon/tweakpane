import {describe, it} from 'mocha';

import {createTestWindow} from '../misc/test-util';
import {Pane} from './pane';

function createPane(): Pane {
	return new Pane({
		document: createTestWindow().document,
		title: 'Title',
	});
}

describe(Pane.name, () => {
	it('should listen fold event', (done) => {
		const pane = createPane();
		pane.on('fold', () => {
			done();
		});

		const folder = pane.controller_.foldable;
		if (folder) {
			folder.set('expanded', false);
		}
	});
});
