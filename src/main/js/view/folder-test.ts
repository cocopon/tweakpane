import {assert} from 'chai';
import {describe, it} from 'mocha';

import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {Disposable} from '../model/disposable';
import {Folder} from '../model/folder';
import {FolderView} from './folder';

describe(FolderView.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const folder = new Folder('title', false);
		const d = new Disposable();
		const v = new FolderView(doc, {
			folder: folder,
			disposable: d,
		});
		d.dispose();
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
