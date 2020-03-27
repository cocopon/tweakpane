import {assert} from 'chai';
import {describe, it} from 'mocha';

import {ButtonController} from '../controller/button';
import {FolderController} from '../controller/folder';
import {InputBindingController} from '../controller/input-binding';
import {NumberTextInputController} from '../controller/input/number-text';
import {MonitorBindingController} from '../controller/monitor-binding';
import {SingleLogMonitorController} from '../controller/monitor/single-log';
import {SeparatorController} from '../controller/separator';
import {TestUtil} from '../misc/test-util';
import {Color} from '../model/color';
import {Disposable} from '../model/disposable';
import {FolderApi} from './folder';

function createApi(): FolderApi {
	const c = new FolderController(TestUtil.createWindow().document, {
		disposable: new Disposable(),
		title: 'Folder',
	});
	return new FolderApi(c);
}

describe(FolderApi.name, () => {
	it('should get expanded', () => {
		const api = createApi();

		api.controller.folder.expanded = false;
		assert.strictEqual(api.expanded, false);
		api.controller.folder.expanded = true;
		assert.strictEqual(api.expanded, true);
	});

	it('should set expanded', () => {
		const api = createApi();

		api.expanded = false;
		assert.strictEqual(api.controller.folder.expanded, false);
		api.expanded = true;
		assert.strictEqual(api.controller.folder.expanded, true);
	});

	it('should dispose', () => {
		const api = createApi();
		api.dispose();
		assert.strictEqual(api.controller.disposable.disposed, true);
	});

	it('should add button', () => {
		const api = createApi();
		const b = api.addButton({
			title: 'push',
		});
		assert.strictEqual(b.controller.button.title, 'push');
	});

	it('should add separator', () => {
		const api = createApi();
		api.addSeparator();

		const cs = api.controller.uiControllerList.items;
		assert.instanceOf(cs[cs.length - 1], SeparatorController);
	});

	it('should add input', () => {
		const PARAMS = {
			foo: 1,
		};
		const api = createApi();
		const bapi = api.addInput(PARAMS, 'foo');
		assert.instanceOf(bapi.controller.controller, NumberTextInputController);
	});

	it('should add monitor', () => {
		const PARAMS = {
			foo: 1,
		};
		const api = createApi();
		const bapi = api.addMonitor(PARAMS, 'foo', {
			interval: 0,
		});
		assert.instanceOf(bapi.controller.controller, SingleLogMonitorController);
	});

	it('should listen fold event', (done) => {
		const api = createApi();
		api.on('fold', () => {
			done();
		});
		api.controller.folder.expanded = false;
	});

	[
		{
			insert: (api: FolderApi, index: number) => {
				api.addInput({foo: 1}, 'foo', {index: index});
			},
			expected: InputBindingController,
		},
		{
			insert: (api: FolderApi, index: number) => {
				api.addMonitor({foo: 1}, 'foo', {
					index: index,
					interval: 0,
				});
			},
			expected: MonitorBindingController,
		},
		{
			insert: (api: FolderApi, index: number) => {
				api.addButton({index: index, title: 'button'});
			},
			expected: ButtonController,
		},
		{
			insert: (api: FolderApi, index: number) => {
				api.addSeparator({
					index: index,
				});
			},
			expected: SeparatorController,
		},
	].forEach((testCase) => {
		context(`when ${testCase.expected.name}`, () => {
			it('should insert input/monitor into specified position', () => {
				const params = {
					bar: 2,
					foo: 1,
				};
				const api = createApi();
				api.addInput(params, 'foo');
				api.addInput(params, 'bar');
				testCase.insert(api, 1);

				const cs = api.controller.uiControllerList.items;
				assert.instanceOf(cs[1], testCase.expected);
			});
		});
	});

	[
		{
			expected: 456,
			params: {
				propertyValue: 123,
				newInternalValue: 456,
			},
		},
		{
			expected: 'changed',
			params: {
				propertyValue: 'text',
				newInternalValue: 'changed',
			},
		},
		{
			expected: true,
			params: {
				propertyValue: false,
				newInternalValue: true,
			},
		},
		{
			expected: '#224488',
			params: {
				propertyValue: '#123',
				newInternalValue: new Color([0x22, 0x44, 0x88], 'rgb'),
			},
		},
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should pass right first argument for change event (local)', (done) => {
				const api = createApi();
				const obj = {foo: params.propertyValue};
				const bapi = api.addInput(obj, 'foo');

				bapi.on('change', (value) => {
					assert.strictEqual(value, expected);
					done();
				});
				bapi.controller.binding.value.rawValue = params.newInternalValue;
			});

			it('should pass right first argument for change event (global)', (done) => {
				const api = createApi();
				const obj = {foo: params.propertyValue};
				const bapi = api.addInput(obj, 'foo');

				api.on('change', (value) => {
					assert.strictEqual(value, expected);
					done();
				});
				bapi.controller.binding.value.rawValue = params.newInternalValue;
			});
		});
	});
});
