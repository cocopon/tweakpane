// @flow

import {describe, it} from 'mocha';

import ButtonController from '../controller/button';
import TestUtil from '../misc/test-util';
import ButtonApi from './button';

describe(ButtonApi.name, () => {
	it('should listen click event', (done) => {
		const c = new ButtonController(TestUtil.createWindow().document, {
			title: 'Button',
		});
		const api = new ButtonApi(c);
		api.on('click', () => {
			done();
		});
		c.button.click();
	});
});
