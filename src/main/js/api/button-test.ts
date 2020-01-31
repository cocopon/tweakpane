import {assert} from 'chai';
import {describe, it} from 'mocha';

import {ButtonController} from '../controller/button';
import {TestUtil} from '../misc/test-util';
import {ButtonApi} from './button';

describe(ButtonApi.name, () => {
	it('should dispose', () => {
		const c = new ButtonController(TestUtil.createWindow().document, {
			title: 'Button',
		});
		const api = new ButtonApi(c);
		api.dispose();

		assert.strictEqual(api.controller.view.disposed, true);
	});

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

	it('should have chainable event handling', () => {
		const c = new ButtonController(TestUtil.createWindow().document, {
			title: 'Button',
		});
		const api = new ButtonApi(c);
		const retval = api.on('click', () => {});
		assert.strictEqual(retval, api);
	});
});
