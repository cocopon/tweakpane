import {assert} from 'chai';
import {describe, it} from 'mocha';

import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {Button} from '../model/button';
import {ViewModel} from '../model/view-model';
import {ButtonView} from './button';

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
