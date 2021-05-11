import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {TestUtil} from '../../../misc/test-util';
import {
	assertDisposes,
	assertInitialState,
	assertUpdates,
} from '../../common/api/test-util';
import {createBlade} from '../../common/model/blade';
import {LabelController} from '../../label/controller/label';
import {LabelPropsObject} from '../../label/view/label';
import {ButtonController} from '../controller/button';
import {ButtonPropsObject} from '../view/button';
import {ButtonApi} from './button';

function createApi(doc: Document): ButtonApi {
	const c = new LabelController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: undefined,
		}),
		valueController: new ButtonController(doc, {
			props: ValueMap.fromObject<ButtonPropsObject>({
				title: 'Button',
			}),
			viewProps: ViewProps.create(),
		}),
	});
	return new ButtonApi(c);
}

describe(ButtonApi.name, () => {
	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc);

		assertInitialState(api);

		const c = api.controller_.valueController as ButtonController;
		assert.strictEqual(c.view.buttonElement.disabled, false);
		assert.strictEqual(api.title, 'Button');
		assert.strictEqual(c.view.buttonElement.textContent, 'Button');
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc);
		const c = api.controller_.valueController as ButtonController;

		assertUpdates(api);
		assert.strictEqual(c.view.buttonElement.disabled, true);

		api.title = 'changed';
		assert.strictEqual(api.title, 'changed');
		assert.strictEqual(c.view.buttonElement.textContent, 'changed');

		api.label = 'updated';
		assert.strictEqual(api.label, 'updated');
		assert.strictEqual(api.controller_.props.get('label'), 'updated');
	});

	it('should listen click event', (done) => {
		const win = createTestWindow();
		const doc = win.document;
		const api = createApi(doc);
		api.on('click', (ev) => {
			assert.strictEqual(ev.target, api);
			done();
		});
		api.controller_.valueController.view.buttonElement.dispatchEvent(
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
		api.controller_.valueController.view.buttonElement.dispatchEvent(
			TestUtil.createEvent(win, 'click'),
		);
	});

	it('should dispose', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc);
		assertDisposes(api);
	});
});
