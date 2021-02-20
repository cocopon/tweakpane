import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {ViewModel} from '../../common/model/view-model';
import {PaneError} from '../../common/pane-error';
import {RootView} from './view';

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
