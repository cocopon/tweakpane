import * as assert from 'assert';
import {describe, it} from 'mocha';

import {LabelPropsObject} from '../../../common/label/view/label.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {TestUtil} from '../../../misc/test-util.js';
import {
	assertDisposes,
	assertInitialState,
	assertUpdates,
} from '../../common/api/test-util.js';
import {createBlade} from '../../common/model/blade.js';
import {ButtonBladeController} from '../controller/button-blade.js';
import {ButtonPropsObject} from '../view/button.js';
import {ButtonApi} from './button.js';

function createApi(doc: Document): ButtonApi {
	const c = new ButtonBladeController(doc, {
		blade: createBlade(),
		buttonProps: ValueMap.fromObject<ButtonPropsObject>({
			title: 'Button',
		}),
		labelProps: ValueMap.fromObject<LabelPropsObject>({
			label: undefined,
		}),
		viewProps: ViewProps.create(),
	});
	return new ButtonApi(c);
}

describe(ButtonApi.name, () => {
	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc);

		assertInitialState(api);

		const c = api.controller.buttonController;
		assert.strictEqual(c.view.buttonElement.disabled, false);
		assert.strictEqual(api.title, 'Button');
		assert.strictEqual(c.view.buttonElement.textContent, 'Button');
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc);
		const c = api.controller.buttonController;

		assertUpdates(api);
		assert.strictEqual(c.view.buttonElement.disabled, true);

		api.title = 'changed';
		assert.strictEqual(api.title, 'changed');
		assert.strictEqual(c.view.buttonElement.textContent, 'changed');

		api.label = 'updated';
		assert.strictEqual(api.label, 'updated');
		assert.strictEqual(
			api.controller.labelController.props.get('label'),
			'updated',
		);
	});

	it('should listen click event', (done) => {
		const win = createTestWindow();
		const doc = win.document;
		const api = createApi(doc);
		const ev = TestUtil.createEvent(win, 'click');
		api.on('click', (e) => {
			assert.strictEqual(e.target, api);
			assert.strictEqual(e.native, ev);
			done();
		});
		api.controller.buttonController.view.buttonElement.dispatchEvent(ev);
	});

	it('should unlisten click event', () => {
		const win = createTestWindow();
		const doc = win.document;
		const api = createApi(doc);
		const handler = () => {
			assert.fail('should not be called');
		};
		api.on('click', handler);
		api.controller.buttonController.view.buttonElement.dispatchEvent(
			TestUtil.createEvent(win, 'click'),
		);
	});

	it('should have chainable event handling', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc);
		const retval = api.on('click', () => {});
		assert.strictEqual(retval, api);
	});

	it('should bind `this` within handler to API', (done) => {
		const win = createTestWindow();
		const doc = win.document;
		const api = createApi(doc);
		api.on('click', function (this: any) {
			assert.strictEqual(this, api);
			done();
		});
		api.controller.buttonController.view.buttonElement.dispatchEvent(
			TestUtil.createEvent(win, 'click'),
		);
	});

	it('should dispose', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc);
		assertDisposes(api);
	});
});
