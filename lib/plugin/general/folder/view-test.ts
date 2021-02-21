import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {Folder} from '../../common/model/folder';
import {ViewModel} from '../../common/model/view-model';
import {PaneError} from '../../common/pane-error';
import {FolderView} from './view';

describe(FolderView.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const folder = new Folder('title', false);
		const m = new ViewModel();
		const v = new FolderView(doc, {
			folder: folder,
			model: m,
		});
		m.dispose();
		assert.throws(() => {
			// tslint:disable-next-line: no-unused-expression
			v.containerElement;
		}, PaneError);
		assert.throws(() => {
			// tslint:disable-next-line: no-unused-expression
			v.titleElement;
		}, PaneError);
		assert.throws(() => {
			// tslint:disable-next-line: no-unused-expression
			folder.expanded = true;
		}, PaneError);
	});
});
