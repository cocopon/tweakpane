import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {ButtonController} from '../controller/button';
import {FolderController} from '../controller/folder';
import {InputBindingController} from '../controller/input-binding';
import {MonitorBindingController} from '../controller/monitor-binding';
import {SeparatorController} from '../controller/separator';
import {TestUtil} from '../misc/test-util';
import {Class} from '../misc/type-util';
import {PlainTweakpane} from './plain-tweakpane';

function createApi(title?: string): PlainTweakpane {
	return new PlainTweakpane({
		document: TestUtil.createWindow().document,
		title: title,
	});
}

describe(PlainTweakpane.name, () => {
	it('should add button', () => {
		const pane = createApi();
		const b = pane.addButton({
			title: 'push',
		});
		assert.strictEqual(b.controller.button.title, 'push');
	});

	it('should add folder', () => {
		const pane = createApi();
		const f = pane.addFolder({
			title: 'folder',
		});
		assert.strictEqual(f.controller.folder.title, 'folder');
		assert.strictEqual(f.controller.folder.expanded, true);
	});

	it('should add collapsed folder', () => {
		const pane = createApi();
		const f = pane.addFolder({
			expanded: false,
			title: 'folder',
		});
		assert.strictEqual(f.controller.folder.expanded, false);
	});

	it('should toggle expanded when clicking title element', () => {
		const c = new PlainTweakpane({
			document: TestUtil.createWindow().document,
			title: 'Tweakpane',
		});

		if (c.controller.view.titleElement) {
			c.controller.view.titleElement.click();
		}

		assert.strictEqual(
			c.controller.folder && c.controller.folder.expanded,
			false,
		);
	});

	it('should add separator', () => {
		const pane = createApi();
		pane.addSeparator();

		const cs = pane.controller.uiContainer.items;
		assert.instanceOf(cs[cs.length - 1], SeparatorController);
	});

	it('should dispose separator', () => {
		const pane = createApi();
		const cs = pane.controller.uiContainer.items;

		const s = pane.addSeparator();
		assert.strictEqual(cs.length, 1);
		s.dispose();
		assert.strictEqual(cs.length, 0);
	});

	it('should handle root folder events', (done) => {
		const pane = createApi('pane');

		pane.on('fold', (expanded) => {
			assert.strictEqual(expanded, false);
			done();
		});

		const f = pane.controller.folder;
		if (!f) {
			throw new Error('Root folder not found');
		}
		f.expanded = false;
	});

	it('should handle folder events', (done) => {
		const pane = createApi();
		const f = pane.addFolder({
			title: 'folder',
		});

		pane.on('fold', (expanded) => {
			assert.strictEqual(expanded, false);
			done();
		});
		f.expanded = false;
	});

	([
		{
			insert: (api, index) => {
				api.addInput({foo: 1}, 'foo', {index: index});
			},
			expected: InputBindingController,
		},
		{
			insert: (api, index) => {
				api.addMonitor({foo: 1}, 'foo', {
					index: index,
					interval: 0,
				});
			},
			expected: MonitorBindingController,
		},
		{
			insert: (api, index) => {
				api.addButton({index: index, title: 'button'});
			},
			expected: ButtonController,
		},
		{
			insert: (api, index) => {
				api.addFolder({index: index, title: 'folder'});
			},
			expected: FolderController,
		},
		{
			insert: (api, index) => {
				api.addSeparator({
					index: index,
				});
			},
			expected: SeparatorController,
		},
	] as {
		insert: (api: PlainTweakpane, index: number) => void;
		expected: Class<any>;
	}[]).forEach((testCase) => {
		context(`when ${testCase.expected.name}`, () => {
			it('should insert input/monitor into specified position', () => {
				const params = {
					bar: 2,
					foo: 1,
				};
				const pane = createApi();
				pane.addInput(params, 'foo');
				pane.addInput(params, 'bar');
				testCase.insert(pane, 1);

				const cs = pane.controller.uiContainer.items;
				assert.instanceOf(cs[1], testCase.expected);
			});
		});
	});

	it('should bind `this` within handler to pane', (done) => {
		const PARAMS = {foo: 1};
		const pane = createApi();
		pane.on('change', function() {
			assert.strictEqual(this, pane);
			done();
		});

		const bapi = pane.addInput(PARAMS, 'foo');
		bapi.controller.binding.value.rawValue = 2;
	});
});
