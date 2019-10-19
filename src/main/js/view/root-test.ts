import {assert} from 'chai';
import {describe, it} from 'mocha';

import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {RootView} from './root';

describe(RootView.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const v = new RootView(doc, {
			folder: null,
		});
		v.dispose();
		assert.throws(() => {
			// tslint:disable-next-line: no-unused-expression
			v.containerElement;
		}, PaneError);
	});
});
