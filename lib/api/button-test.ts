import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {ButtonController} from '../plugin/blade/button/controller';
import {Blade} from '../plugin/blade/common/model/blade';
import {ButtonApi} from './button';

describe(ButtonApi.name, () => {
	it('should listen click event', (done) => {
		const c = new ButtonController(TestUtil.createWindow().document, {
			title: 'Button',
			blade: new Blade(),
		});
		const api = new ButtonApi(c);
		api.on('click', () => {
			done();
		});
		c.button.click();
	});

	it('should have chainable event handling', () => {
		const c = new ButtonController(TestUtil.createWindow().document, {
			blade: new Blade(),
			title: 'Button',
		});
		const api = new ButtonApi(c);
		const retval = api.on('click', () => {});
		assert.strictEqual(retval, api);
	});

	it('should bind `this` within handler to API', (done) => {
		const c = new ButtonController(TestUtil.createWindow().document, {
			blade: new Blade(),
			title: 'Button',
		});
		const api = new ButtonApi(c);
		api.on('click', function(this: any) {
			assert.strictEqual(this, api);
			done();
		});
		c.button.click();
	});
});
