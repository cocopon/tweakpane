import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {createViewProps} from '../../../common/model/view-props';
import {Blade} from '../../common/model/blade';
import {LabeledController} from '../../labeled/controller';
import {ButtonController} from '../controller/button';
import {ButtonApi} from './button';

function createApi(doc: Document): ButtonApi {
	const c = new LabeledController(doc, {
		blade: new Blade(),
		valueController: new ButtonController(doc, {
			title: 'Button',
			viewProps: createViewProps(),
		}),
	});
	return new ButtonApi(c);
}

describe(ButtonApi.name, () => {
	it('should have initial state', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(doc);
		const c = api.controller_.valueController as ButtonController;

		assert.strictEqual(api.hidden, false);
		assert.strictEqual(api.disabled, false);
		assert.strictEqual(c.view.buttonElement.disabled, false);
	});

	it('should update properties', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(doc);
		const c = api.controller_.valueController as ButtonController;

		api.hidden = true;
		assert.strictEqual(
			api.controller_.view.element.classList.contains('tp-v-hidden'),
			true,
		);

		api.disabled = true;
		assert.strictEqual(
			c.view.element.classList.contains('tp-v-disabled'),
			true,
		);
		assert.strictEqual(c.view.buttonElement.disabled, true);
	});

	it('should listen click event', (done) => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(doc);
		api.on('click', () => {
			done();
		});
		api.controller_.valueController.button.click();
	});

	it('should have chainable event handling', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(doc);
		const retval = api.on('click', () => {});
		assert.strictEqual(retval, api);
	});

	it('should bind `this` within handler to API', (done) => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(doc);
		api.on('click', function(this: any) {
			assert.strictEqual(this, api);
			done();
		});
		api.controller_.valueController.button.click();
	});

	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(doc);
		api.dispose();
		assert.strictEqual(api.controller_.blade.disposed, true);
	});
});
