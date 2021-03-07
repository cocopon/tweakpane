import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {ButtonController} from '../plugin/blade/button/controller/button';
import {Blade} from '../plugin/blade/common/model/blade';
import {LabeledController} from '../plugin/blade/labeled/controller';
import {ButtonApi} from './button';

describe(ButtonApi.name, () => {
	it('should listen click event', (done) => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			valueController: new ButtonController(doc, {
				title: 'Button',
			}),
		});
		const api = new ButtonApi(c);
		api.on('click', () => {
			done();
		});
		c.valueController.button.click();
	});

	it('should have chainable event handling', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			valueController: new ButtonController(doc, {
				title: 'Button',
			}),
		});
		const api = new ButtonApi(c);
		const retval = api.on('click', () => {});
		assert.strictEqual(retval, api);
	});

	it('should bind `this` within handler to API', (done) => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			valueController: new ButtonController(doc, {
				title: 'Button',
			}),
		});
		const api = new ButtonApi(c);
		api.on('click', function(this: any) {
			assert.strictEqual(this, api);
			done();
		});
		c.valueController.button.click();
	});
});
