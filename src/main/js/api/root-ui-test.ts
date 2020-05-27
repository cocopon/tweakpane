import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {ButtonController} from '../controller/button';
import {FolderController} from '../controller/folder';
import {InputBindingController} from '../controller/input-binding';
import {MonitorBindingController} from '../controller/monitor-binding';
import {RootController} from '../controller/root';
import {SeparatorController} from '../controller/separator';
import {TestUtil} from '../misc/test-util';
import {Disposable} from '../model/disposable';
import {RootApi} from './root';

function createApi(title?: string): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {
		disposable: new Disposable(),
		title: title,
	});
	return new RootApi(c);
}

describe(RootApi.name, () => {
	it('should add button', () => {
		const api = createApi();
		const b = api.addButton({
			title: 'push',
		});
		assert.strictEqual(b.controller.button.title, 'push');
	});

	it('should add folder', () => {
		const api = createApi();
		const f = api.addFolder({
			title: 'folder',
		});
		assert.strictEqual(f.controller.folder.title, 'folder');
		assert.strictEqual(f.controller.folder.expanded, true);
	});

	it('should add collapsed folder', () => {
		const api = createApi();
		const f = api.addFolder({
			expanded: false,
			title: 'folder',
		});
		assert.strictEqual(f.controller.folder.expanded, false);
	});

	it('should add separator', () => {
		const api = createApi();
		api.addSeparator();

		const cs = api.controller.uiControllerList.items;
		assert.instanceOf(cs[cs.length - 1], SeparatorController);
	});

	it('should dispose separator', () => {
		const api = createApi();
		const cs = api.controller.uiControllerList.items;

		const s = api.addSeparator();
		assert.strictEqual(cs.length, 1);
		s.dispose();
		assert.strictEqual(cs.length, 0);
	});

	it('should handle root folder events', (done) => {
		const api = createApi('pane');

		api.on('fold', (expanded) => {
			assert.strictEqual(expanded, false);
			done();
		});

		const f = api.controller.folder;
		if (!f) {
			throw new Error('Root folder not found');
		}
		f.expanded = false;
	});

	it('should handle folder events', (done) => {
		const api = createApi();
		const f = api.addFolder({
			title: 'folder',
		});

		api.on('fold', (expanded) => {
			assert.strictEqual(expanded, false);
			done();
		});
		f.expanded = false;
	});

	[
		{
			insert: (api: RootApi, index: number) => {
				api.addInput({foo: 1}, 'foo', {index: index});
			},
			expected: InputBindingController,
		},
		{
			insert: (api: RootApi, index: number) => {
				api.addMonitor({foo: 1}, 'foo', {
					index: index,
					interval: 0,
				});
			},
			expected: MonitorBindingController,
		},
		{
			insert: (api: RootApi, index: number) => {
				api.addButton({index: index, title: 'button'});
			},
			expected: ButtonController,
		},
		{
			insert: (api: RootApi, index: number) => {
				api.addFolder({index: index, title: 'folder'});
			},
			expected: FolderController,
		},
		{
			insert: (api: RootApi, index: number) => {
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
});
