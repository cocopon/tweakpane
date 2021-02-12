import {assert} from 'chai';
import {describe, it} from 'mocha';

import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {ViewModel} from '../model/view-model';
import {RootView} from './root';

describe(RootView.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const m = new ViewModel();
		const v = new RootView(doc, {
			folder: null,
			model: m,
		});
		m.dispose();
		assert.throws(() => {
			// tslint:disable-next-line: no-unused-expression
			v.containerElement;
		}, PaneError);
	});
});
