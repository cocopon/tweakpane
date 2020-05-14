import {assert} from 'chai';
import {describe, it} from 'mocha';

import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {Disposable} from '../model/disposable';
import {RootView} from './root';

describe(RootView.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const d = new Disposable();
		const v = new RootView(doc, {
			disposable: d,
			folder: null,
		});
		d.dispose();
		assert.throws(() => {
			// tslint:disable-next-line: no-unused-expression
			v.containerElement;
		}, PaneError);
	});
});
