import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {Button} from '../../common/model/button';
import {ViewModel} from '../../common/model/view-model';
import {PaneError} from '../../common/pane-error';
import {ButtonView} from './view';

describe(ButtonView.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const m = new ViewModel();
		const v = new ButtonView(doc, {
			button: new Button('title'),
			model: m,
		});
		m.dispose();
		assert.throws(() => {
			// tslint:disable-next-line: no-unused-expression
			v.buttonElement;
		}, PaneError);
	});
});
